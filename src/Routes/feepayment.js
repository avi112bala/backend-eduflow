const express = require('express')
const { UserDataAuth } = require('../middleware/UserAuthData')
require('dotenv')
const instance = require("../utils/razorpay")
const feeenums = require('../utils/feesenums')
const feePaymentmodels = require('../Models/feepayment')
const feeRouter = express.Router()
const User = require("../Models/authmodels")

feeRouter.post('/create/order', UserDataAuth, async (req, res) => {
    try {
        const { firstName, lastName, email } = req.user
        const { feeType, feeAmount } = req.body

        const order = await instance.orders.create({
            "amount": feeenums[feeType] * 100,
            "currency": "INR",
            "receipt": "receipt#1",
            "partial_payment": false,
            "notes": {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "feeType": feeType,
                'feeAmount': feeAmount
            }
        })

        const payment = new feePaymentmodels({
            user: req.user._id,
            orderId: order?.id,
            status: order.status,
            feeAmount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes
        })

        const savedPayment = await payment.save()

        return res.status(200).json({ ...savedPayment.toJSON(), keyId: process.env.RAZOR_PAY_KEY })


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
feeRouter.post('/create/order/:id', UserDataAuth, async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        const { firstName, lastName, email } = user
        const { feeType, feeAmount } = req.body

        const order = await instance.orders.create({
            "amount": feeenums[feeType] * 100,
            "currency": "INR",
            "receipt": "receipt#1",
            "partial_payment": false,
            "notes": {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "feeType": feeType,
                'feeAmount': feeAmount
            }
        })

        const payment = new feePaymentmodels({
            user: id,
            orderId: order?.id,
            status: order.status,
            feeAmount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes
        })

        const savedPayment = await payment.save()

        return res.status(200).json({ ...savedPayment.toJSON(), keyId: process.env.RAZOR_PAY_KEY })


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

feeRouter.post('/create-payment-link/:studentId', UserDataAuth, async (req, res) => {
    try {
        const { studentId } = req.params;
        const { feeType, feeAmount } = req.body; // e.g. amount in rupees, feeType: "monthly"

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const paymentLink = await instance.paymentLink.create({
            amount: feeAmount * 100, // Razorpay expects paise, so multiply by 100
            currency: "INR",
            description: `${feeType} fee for ${student.name}`,
            customer: {
                name: student.name,
                email: student.email,
                contact: student.phoneNumber,
            },
            notify: {
                sms: true,
                email: true,
            },
            reminder_enable: true,
            callback_url: "https://www.avi.monster/login", // hits after payment
            callback_method: "get",
            notes: {
                studentId: student._id.toString(),
                feeType,
            },
        });

        // optionally save paymentLink.id in your DB to track status later
        return res.status(200).json({
            message: "Payment link created",
            data: {
                short_url: paymentLink.short_url,
                id: paymentLink.id,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

feeRouter.post('/payment/webhook', async (req, res) => {
    try {
        const webhooksig = req.get('X-Razorpay-Signature')
        validateWebhookSignature(JSON.stringify(req.body), webhooksig, process.env.RAZOR_PAY_WBHOOK_SCREAT)
        if (!webhooksig) {
            return res.status(400).json({ message: "webhook signature is invalid" })
        }

        const PaymentDetails = req.body.payload.payment.entity
        const payment = await feePaymentmodels.findOne({ orderId: PaymentDetails.order_id })
        payment.status = PaymentDetails.status
        await payment.save()

        const user = await User.findOne({ _id: payment.user, role: "student" })
        user.feeStatus = payment.notes.feeStatus
        await user.save()

        // if (req.body.event == "payment.captured") {
        // }

        // if (req.body.event == "payment.failed") {
        // }
        res.status(200).json({ message: "Webhook is received successfully!" })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

module.exports = feeRouter