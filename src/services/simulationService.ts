/**
 * Simulation Service
 * 
 * Provides an honest, decoupled abstraction layer for simulated external integrations
 * (Payments, Banking/IMPS, Telephony/Masked Relay, WhatsApp Webhooks, GPS Route Telemetry,
 * Identity/Police Background Verification, and Invoicing Documents).
 * 
 * In production, this service can be replaced with real external integrations (e.g.,
 * Razorpay/Stripe, Exotel/Twilio, Google Maps Directions API, Digilocker/UIDAI, GST E-Invoice portal)
 * without rewriting the frontend UI components.
 */

export interface SimulationResult {
  success: boolean;
  referenceId: string;
  isSimulated: true;
  message: string;
  disclaimer: string;
}

export interface VerificationProfileAudit {
  isSimulated: true;
  screeningType: string;
  status: 'mock_verified' | 'pending' | 'unverified';
  disclaimer: string;
  verifiedItems: Array<{
    title: string;
    description: string;
    verifiedAt: string;
    mockAuthority: string;
  }>;
}

export class SimulationService {
  /**
   * Simulates customer payment authorization (UPI, Card, Cash).
   * Does NOT charge or transfer real money.
   */
  public simulatePayment(params: {
    amount: number;
    method: 'upi' | 'cash' | 'card';
    currencySymbol?: string;
  }): SimulationResult {
    const symbol = params.currencySymbol || '₹';
    const txnId = `DEMO-PAY-${Date.now().toString().slice(-6)}`;
    return {
      success: true,
      referenceId: txnId,
      isSimulated: true,
      message: `[Demo Sandbox] Payment of ${symbol}${params.amount} simulated via ${params.method.toUpperCase()} (No real funds transferred)`,
      disclaimer: 'Demo Simulation: No real financial transaction was initiated. No actual funds were debited or transferred.',
    };
  }

  /**
   * Simulates technician bank payout / instant cashout via IMPS.
   * Does NOT execute real interbank wire transfers.
   */
  public simulateBankCashout(params: {
    amount: number;
    bankAccountMasked?: string;
    currencySymbol?: string;
  }): SimulationResult {
    const symbol = params.currencySymbol || '₹';
    const account = params.bankAccountMasked || 'HDFC Bank ****4091';
    const ref = `DEMO-IMPS-${Date.now().toString().slice(-6)}`;
    return {
      success: true,
      referenceId: ref,
      isSimulated: true,
      message: `[Demo Payout Sandbox] Simulated cashout of ${symbol}${params.amount} to ${account} (No real bank transfer occurred)`,
      disclaimer: 'Demo Simulation: Test transfer record generated in simulation sandbox. No real bank transfer took place.',
    };
  }

  /**
   * Simulates an encrypted private telephone relay between resident and technician.
   * Does NOT place live telecom voice calls.
   */
  public simulateVoiceCall(targetName: string, role: 'customer' | 'technician' | 'support' = 'technician'): SimulationResult {
    return {
      success: true,
      referenceId: `DEMO-VOICE-${Date.now().toString().slice(-6)}`,
      isSimulated: true,
      message: `[Demo Voice Relay] Simulated secure line connection to ${targetName} (Demo Mode - No live call placed)`,
      disclaimer: 'Demo Simulation: Voice relay dialog is simulated for interface demonstration purposes.',
    };
  }

  /**
   * Simulates live messaging / photo chat session.
   */
  public simulateChat(targetName: string): SimulationResult {
    return {
      success: true,
      referenceId: `DEMO-CHAT-${Date.now().toString().slice(-6)}`,
      isSimulated: true,
      message: `[Demo Messenger] Masked chat channel preview open with ${targetName} (Simulated)`,
      disclaimer: 'Demo Simulation: Chat channel is a sandbox preview.',
    };
  }

  /**
   * Simulates milestone dispatch webhooks (e.g. WhatsApp status alerts).
   */
  public simulateNotification(enabled: boolean): SimulationResult {
    return {
      success: true,
      referenceId: `DEMO-NOTIF-${Date.now().toString().slice(-6)}`,
      isSimulated: true,
      message: enabled
        ? '[Demo Webhook] WhatsApp milestone simulation enabled (Demo Alerts)'
        : '[Demo Webhook] WhatsApp milestone simulation disabled',
      disclaimer: 'Demo Simulation: Automated messaging uses simulated test webhooks.',
    };
  }

  /**
   * Simulates GPS location tracking & transit telemetry.
   * Does NOT connect to live satellite/cellular GPS hardware.
   */
  public simulateGpsTelemetry(providerName: string, locationArea: string, distanceKm: number): SimulationResult {
    return {
      success: true,
      referenceId: `DEMO-GPS-${Date.now().toString().slice(-6)}`,
      isSimulated: true,
      message: `[Demo GPS Telemetry] Simulated coordinates for ${providerName} (${distanceKm} km away near ${locationArea})`,
      disclaimer: 'Demo Simulation: Provider coordinates and transit speed are simulated mathematical trajectories. No real satellite or cellular GPS hardware is linked.',
    };
  }

  /**
   * Simulates emergency utility hotline / SOS dialer.
   * Clarifies that this is a prototype action and not an official 112 / police dispatch.
   */
  public simulateSosHotline(utilityName: string, helpline: string): SimulationResult {
    return {
      success: true,
      referenceId: `DEMO-SOS-${Date.now().toString().slice(-6)}`,
      isSimulated: true,
      message: `[Demo SOS Hotline] Simulated emergency dialer to ${utilityName} (${helpline}). In a real life emergency, dial 112 or local authorities.`,
      disclaimer: 'Demo Simulation: Prototype hotline action. For actual emergencies, contact municipal emergency services directly.',
    };
  }

  /**
   * Simulates doorstep PIN verification handshake.
   */
  public simulateDoorstepHandshake(pin: string, expectedPin: string): {
    success: boolean;
    message: string;
    isSimulated: true;
  } {
    const isValid = pin === expectedPin;
    return {
      success: isValid,
      isSimulated: true,
      message: isValid
        ? '[Demo Handshake] PIN verified! Work authorization unlocked in simulation mode.'
        : `[Demo Handshake] Incorrect PIN (${pin}). Expected ${expectedPin} for demonstration.`,
    };
  }

  /**
   * Provides honest verification audit information explaining that provider credentials
   * in this prototype are mock data and not legally verified government or police records.
   */
  public getVerificationAudit(providerName: string): VerificationProfileAudit {
    return {
      isSimulated: true,
      screeningType: 'Prototype Demonstration Screening',
      status: 'mock_verified',
      disclaimer: 'DISCLAIMER: Verification badges and credential records shown in SATTHI are prototype mock data for workflow demonstration. They do not constitute official government (UIDAI/Aadhaar) or law enforcement police background clearance.',
      verifiedItems: [
        {
          title: 'Identity Document Screening (Simulated)',
          description: 'Government photo ID mock review for onboarding simulation.',
          verifiedAt: 'October 2026',
          mockAuthority: 'Internal Sandbox Review',
        },
        {
          title: 'Trade & Technical Skill Review (Simulated)',
          description: 'Electrician & wireman certification self-declaration checked against sample criteria.',
          verifiedAt: 'October 2026',
          mockAuthority: 'SATTHI Onboarding Sandbox',
        },
        {
          title: 'Simulated Background Check',
          description: 'Mock non-criminal declaration recorded in test database.',
          verifiedAt: 'October 2026',
          mockAuthority: 'Demo Compliance Desk',
        },
      ],
    };
  }

  /**
   * Generates honest demo document disclaimer for invoice previews and receipts.
   */
  public getInvoiceDisclaimer(): {
    documentTitle: string;
    badgeText: string;
    legalNotice: string;
    isSimulated: boolean;
  } {
    return {
      documentTitle: 'Service Estimate & Receipt (Demo Simulation)',
      badgeText: 'Demo Sandbox Document',
      legalNotice:
        'DEMO DOCUMENT: This itemized receipt is generated in a prototype simulation environment for workflow demonstration. It does not constitute a legal tax invoice under GST laws. No tax liability is created or reported.',
      isSimulated: true,
    };
  }
}

export const simulationService = new SimulationService();
