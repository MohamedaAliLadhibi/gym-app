const supabaseService = require('../services/supabaseService');
const stripeService = require('../services/stripeService');
const { validationResult } = require('express-validator');

const membershipController = {
  // Get all membership types
  getMembershipTypes: async (req, res) => {
    try {
      const memberships = await supabaseService.getMembershipTypes();
      
      res.json({
        success: true,
        data: memberships
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Subscribe to membership
  subscribeToMembership: async (req, res) => {
    try {
      const userId = req.user.id;
      const { membership_type_id, payment_method_id } = req.body;
      
      // Get membership details
      const membership = await supabaseService.getMembershipById(membership_type_id);
      
      if (membership.name === 'free') {
        // Free membership - no payment needed
        await supabaseService.updateUserMembership(userId, membership_type_id);
        
        return res.json({
          success: true,
          message: 'Free membership activated',
          data: { membership }
        });
      }

      // Premium membership - process payment
      const paymentResult = await stripeService.createSubscription(
        userId,
        membership,
        payment_method_id
      );

      // Update user membership in database
      await supabaseService.createUserSubscription(userId, {
        membership_type_id,
        stripe_subscription_id: paymentResult.subscriptionId,
        stripe_customer_id: paymentResult.customerId,
        amount_paid: membership.price
      });

      res.json({
        success: true,
        message: 'Premium membership activated',
        data: {
          membership,
          payment: paymentResult
        }
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Cancel subscription
  cancelSubscription: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const result = await stripeService.cancelSubscription(userId);
      await supabaseService.cancelUserSubscription(userId);
      
      res.json({
        success: true,
        message: 'Subscription cancelled successfully',
        data: result
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get user subscription details
  getUserSubscription: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const subscription = await supabaseService.getUserSubscription(userId);
      
      res.json({
        success: true,
        data: subscription
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Webhook for Stripe events
  handleStripeWebhook: async (req, res) => {
    try {
      const event = req.body;
      
      await stripeService.handleWebhook(event);
      
      res.json({ received: true });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = membershipController;