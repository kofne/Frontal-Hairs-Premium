import { NextRequest, NextResponse } from 'next/server';
import { createReferral, getReferralByCode } from '@/lib/supabase';
import { FormData } from '@/types/form';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const formData: FormData = body.formData;
    const paymentData = body.paymentData;

    // Create email transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Calculate total price
    const pricePerTracksuit = 25; // $250 / 10 tracksuits = $25 each
    const totalPrice = formData.quantity * pricePerTracksuit;

    // Send email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'solkim1985@gmail.com',
      subject: 'New Gucci Tracksuit Order',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">🎉 New Gucci Tracksuit Order Received!</h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #DC143C; margin-top: 0;">Customer Information</h3>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Delivery Address:</strong> ${formData.deliveryAddress}</p>
            ${formData.referralCode ? `<p><strong>Referral Code:</strong> ${formData.referralCode}</p>` : ''}
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #DC143C; margin-top: 0;">Product Details</h3>
            <p><strong>Category:</strong> ${formData.category}</p>
            <p><strong>Size:</strong> ${formData.size}</p>
            <p><strong>Quantity:</strong> ${formData.quantity} tracksuit${formData.quantity > 1 ? 's' : ''}</p>
            <p><strong>Selected Image:</strong> ${formData.selectedImage}</p>
          </div>
          
          <div style="background: #8B4513; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">💰 Payment Details</h3>
            <p><strong>Quantity:</strong> ${formData.quantity} × $${pricePerTracksuit} each</p>
            <p><strong>Total Amount Paid:</strong> $${totalPrice.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> PayPal</p>
            <p><strong>Payment ID:</strong> ${paymentData?.paymentID || 'N/A'}</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Order received on ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    };

    const emailResult = await transporter.sendMail(mailOptions);
    
    if (!emailResult) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Handle referral if exists
    if (formData.referralCode) {
      try {
        const { data: referral } = await getReferralByCode(formData.referralCode);
        if (referral) {
          // In a real implementation, you would process the $100 referral payment here
          console.log('Referral payment of $100 should be processed for:', formData.referralCode);
        }
      } catch (error) {
        console.error('Referral processing error:', error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order submitted successfully' 
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
