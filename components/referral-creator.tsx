'use client';

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CheckCircle,
  AlertCircle,
  Copy,
  Users,
  DollarSign,
} from 'lucide-react'

export function ReferralCreator() {
  const [email, setEmail] = useState('')
  const [paypalEmail, setPaypalEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/create-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, paypalEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setReferralCode(data.referralCode)
        setStatus('success')
      } else {
        setErrorMessage(data.error || 'Failed to create referral code')
        setStatus('error')
      }
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      alert('Referral code copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-brown-50 p-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl md:text-6xl font-bold text-brown-800 mb-4'>
            🎯 Become an Affiliate
          </h1>
          <p className='text-xl text-brown-600'>
            Create your referral code and earn{' '}
            <span className='font-bold text-red-600'>$100</span> for each
            successful referral!
          </p>
        </div>

        <Card className='bg-white/80 backdrop-blur-sm border-brown-200'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-brown-800'>
              <Users className='w-6 h-6' />
              Create Your Referral Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label htmlFor='email' className='text-brown-700'>
                  Email Address
                </Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='your@email.com'
                  required
                  className='border-brown-300'
                />
              </div>

              <div>
                <Label htmlFor='paypalEmail' className='text-brown-700'>
                  PayPal Email
                </Label>
                <Input
                  id='paypalEmail'
                  type='email'
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder='your@paypal.com'
                  required
                  className='border-brown-300'
                />
                <p className='text-sm text-brown-600 mt-1'>
                  This is where your $100 bonus will be sent when someone uses
                  your referral code.
                </p>
              </div>

              <Button
                type='submit'
                disabled={isSubmitting || !email || !paypalEmail}
                className='w-full bg-red-600 hover:bg-red-700'
              >
                {isSubmitting ? 'Creating...' : 'Create Referral Code'}
              </Button>
            </form>

            {status === 'success' && (
              <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
                <div className='flex items-center gap-3 text-green-800 mb-3'>
                  <CheckCircle className='w-6 h-6' />
                  <h3 className='font-semibold'>Referral Code Created!</h3>
                </div>
                <div className='bg-white p-3 rounded border border-green-300'>
                  <div className='flex items-center justify-between'>
                    <span className='font-mono text-lg font-bold text-green-700'>
                      {referralCode}
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={copyToClipboard}
                    >
                      <Copy className='w-4 h-4 mr-2' />
                      Copy
                    </Button>
                  </div>
                </div>
                <p className='text-sm text-green-700 mt-2'>
                  Share this code with friends and earn $100 for each successful
                  purchase!
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className='mt-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
                <div className='flex items-center gap-3 text-red-800'>
                  <AlertCircle className='w-6 h-6' />
                  <div>
                    <h3 className='font-semibold'>Error</h3>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='mt-8 bg-white/80 backdrop-blur-sm border-brown-200'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-brown-800'>
              <DollarSign className='w-6 h-6' />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid md:grid-cols-3 gap-4'>
              <div className='text-center p-4 bg-amber-50 rounded-lg'>
                <div className='text-3xl mb-2'>1️⃣</div>
                <h3 className='font-semibold text-brown-800'>Create Code</h3>
                <p className='text-sm text-brown-600'>
                  Generate your unique referral code
                </p>
              </div>
              <div className='text-center p-4 bg-red-50 rounded-lg'>
                <div className='text-3xl mb-2'>2️⃣</div>
                <h3 className='font-semibold text-brown-800'>Share</h3>
                <p className='text-sm text-brown-600'>
                  Share your code with friends and family
                </p>
              </div>
              <div className='text-center p-4 bg-green-50 rounded-lg'>
                <div className='text-3xl mb-2'>3️⃣</div>
                <h3 className='font-semibold text-brown-800'>Earn</h3>
                <p className='text-sm text-brown-600'>
                  Get $100 for each successful referral
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
