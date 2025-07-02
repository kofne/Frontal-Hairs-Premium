import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const formData = body.formData;
    const paymentData = body.paymentData;

    // Calculate quantity and selected image from selectedItems
    const selectedItems = formData.selectedItems || [];
    const quantity = selectedItems.length;

    const pricePerItem = 25; // $250 / 10 items = $25 each
    const totalPrice = quantity * pricePerItem;

    // Create email transporter (fix typo)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Send email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'solkim1985@gmail.com',
      subject: 'New Frontal Hair Order',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">🎉 New Frontal Hair Order Received!</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #DC143C; margin-top: 0;">Customer Information</h3>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Delivery Address:</strong> ${formData.deliveryAddress}</p>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #DC143C; margin-top: 0;">Product Details</h3>
            <p><strong>Quantity:</strong> ${quantity} frontal hair${quantity > 1 ? 's' : ''}</p>
            <p><strong>Selected Images:</strong> ${selectedItems.map(item => item.image).join(', ')}</p>
          </div>
          <div style="background: #8B4513; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">💰 Payment Details</h3>
            <p><strong>Quantity:</strong> ${quantity} × $${pricePerItem} each</p>
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
