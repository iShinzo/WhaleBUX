import { supabase } from '../lib/supabase'
import { Database } from '../lib/database.types'
import { ethers } from 'ethers'
import { WALLET_CONFIG } from '../config/walletConfig'

type Transaction = Database['public']['Tables']['transactions']['Row']

export class TransactionService {
  static async createSwapTransaction(
    userId: string,
    amount: number,
    walletAddress: string
  ) {
    // Start transaction in pending state
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'SWAP',
        amount: amount,
        status: 'PENDING'
      })
      .select()
      .single()

    if (txError) throw txError

    try {
      // Deduct WBUX dollars from user
      const { error: updateError } = await supabase
        .from('users')
        .update({
          wbux_dollars: supabase.rpc('decrement', { amount })
        })
        .eq('id', userId)

      if (updateError) throw updateError

      // Interact with smart contract
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      
      // Connect to WBUX token contract using rewards wallet
      const rewardsWallet = new ethers.Wallet(
        process.env.REWARDS_PRIVATE_KEY || '', 
        provider
      )
      
      const contract = new ethers.Contract(
        WALLET_CONFIG.CONTRACTS.bnb.WBUX_TOKEN,
        ['function transfer(address to, uint256 amount) returns (bool)'],
        rewardsWallet
      )

      // Convert amount to WBUX tokens (10000:1 ratio)
      const tokenAmount = ethers.utils.parseEther((amount / 10000).toString())
      
      // Transfer tokens from rewards wallet to user
      const tx = await contract.transfer(walletAddress, tokenAmount, {
        gasLimit: WALLET_CONFIG.TRANSACTION_SETTINGS.gasLimit
      })
      
      const receipt = await tx.wait(WALLET_CONFIG.TRANSACTION_SETTINGS.confirmations)

      // Update transaction with success
      const { error: finalizeError } = await supabase
        .from('transactions')
        .update({
          status: 'COMPLETED',
          tx_hash: receipt.transactionHash
        })
        .eq('id', transaction.id)

      if (finalizeError) throw finalizeError

      return { success: true, txHash: receipt.transactionHash }
    } catch (error) {
      // Revert transaction status to failed
      await supabase
        .from('transactions')
        .update({
          status: 'FAILED'
        })
        .eq('id', transaction.id)

      throw error
    }
  }

  static async processPayment(
    userId: string,
    amount: number,
    description: string
  ) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const userAddress = await signer.getAddress()

      // Connect to WBUX token contract
      const contract = new ethers.Contract(
        WALLET_CONFIG.CONTRACTS.bnb.WBUX_TOKEN,
        ['function transfer(address to, uint256 amount) returns (bool)'],
        signer
      )

      // Transfer tokens to treasury wallet
      const tx = await contract.transfer(
        WALLET_CONFIG.CONTRACTS.bnb.TREASURY_WALLET,
        ethers.utils.parseEther(amount.toString()),
        {
          gasLimit: WALLET_CONFIG.TRANSACTION_SETTINGS.gasLimit
        }
      )

      const receipt = await tx.wait(WALLET_CONFIG.TRANSACTION_SETTINGS.confirmations)

      // Record transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'PAYMENT',
          amount: amount,
          status: 'COMPLETED',
          tx_hash: receipt.transactionHash,
          description: description
        })

      return { success: true, txHash: receipt.transactionHash }
    } catch (error) {
      console.error('Payment processing error:', error)
      throw error
    }
  }

  static async getUserTransactions(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}