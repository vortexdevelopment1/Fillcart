import crypto from "node:crypto";
import type { PrismaClient } from "../../../../database/generated/client/client.js";
import type { CreateSupportTicketRequest } from "@fillcart/validations";

export interface SupportContact {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  availability: string;
  category: "ENGINEERING" | "DATABASE" | "PAYMENT_GATEWAY" | "LOGISTICS";
}

export interface SupportRunbook {
  id: string;
  title: string;
  category: string;
  summary: string;
  steps: string[];
}

export interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdByName: string;
  createdAt: string;
}

export class SupportService {
  private inMemoryTickets: SupportTicketItem[] = [];

  constructor(private prisma: PrismaClient) {}

  public async getSupportInfo(): Promise<{
    contacts: SupportContact[];
    runbooks: SupportRunbook[];
    recentTickets: SupportTicketItem[];
  }> {
    const contacts: SupportContact[] = [
      {
        id: "cnt-1",
        role: "Primary On-Call Platform Engineer",
        name: "DevOps Rapid Response",
        email: "devops-oncall@fillcart.internal",
        phone: "+91 99000 11223",
        availability: "24/7 Priority Emergency",
        category: "ENGINEERING",
      },
      {
        id: "cnt-2",
        role: "Database Administration & Replication",
        name: "PostgreSQL DBA Desk",
        email: "dba@fillcart.internal",
        phone: "+91 99000 11224",
        availability: "08:00 - 22:00 IST",
        category: "DATABASE",
      },
      {
        id: "cnt-3",
        role: "Nodal Escrow & Payment Gateway Desk",
        name: "Razorpay / Cashfree Nodal Support",
        email: "payments-escalation@fillcart.internal",
        phone: "1800-200-8899",
        availability: "Mon-Sat 09:00 - 19:00 IST",
        category: "PAYMENT_GATEWAY",
      },
      {
        id: "cnt-4",
        role: "Dispatch Engine & Rider Operations Lead",
        name: "Central Logistics Control",
        email: "dispatch-ops@fillcart.internal",
        phone: "+91 99000 11225",
        availability: "06:00 - 00:00 IST",
        category: "LOGISTICS",
      },
    ];

    const runbooks: SupportRunbook[] = [
      {
        id: "rb-kyc",
        title: "Vendor & Rider KYC Approval Protocol",
        category: "Compliance",
        summary: "Standard validation guidelines for Aadhaar, PAN, FSSAI, and Driving License.",
        steps: [
          "Verify that applicant name matches exactly with submitted identity card.",
          "Check document expiration date (especially for FSSAI food licenses and Driving Licenses).",
          "If rejected, select mandatory rejection reason code and input clear corrective remarks for the applicant.",
          "Final approval activates merchant store or rider fleet delivery status atomically.",
        ],
      },
      {
        id: "rb-refunds",
        title: "Order Cancellation & Dispute Refund SOP",
        category: "Customer Experience",
        summary: "Procedures for manual cancellation overrides and customer wallet/gateway refund releases.",
        steps: [
          "Delivered orders cannot be cancelled via normal status flow.",
          "For damaged/missing items, initiate partial refund via Finance Hub with photographic proof.",
          "System automatically reverses delivery fees and adjusts merchant commission ledger.",
          "Customer wallet refunds reflect instantly; original payment mode refunds settle within 3-5 bank days.",
        ],
      },
      {
        id: "rb-security",
        title: "Staff Security & Incident Response",
        category: "Governance",
        summary: "Protocol for compromised accounts, staff lockout overrides, and credential reset.",
        steps: [
          "In case of suspected breach, immediately toggle Account Active toggle to off in Staff Management.",
          "Super Admin credentials cannot be deleted or revoked via normal runtime endpoints.",
          "Check Audit Logs page for IP anomalies and filter by actor email.",
          "File a Critical Tech Ticket if persistent brute-force lockouts are observed.",
        ],
      },
    ];

    return {
      contacts,
      runbooks,
      recentTickets: this.inMemoryTickets,
    };
  }

  public async createTicket(
    adminUserId: string,
    adminName: string,
    data: CreateSupportTicketRequest
  ): Promise<SupportTicketItem> {
    const ticketNumber = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const ticket: SupportTicketItem = {
      id: crypto.randomUUID(),
      ticketNumber,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      description: data.description,
      status: "OPEN",
      createdByName: adminName,
      createdAt: new Date().toISOString(),
    };

    this.inMemoryTickets.unshift(ticket);

    // Write to audit log
    try {
      await this.prisma.authAuditLog.create({
        data: {
          id: crypto.randomUUID(),
          actorType: "USER",
          actorId: adminUserId,
          actorUserId: adminUserId,
          targetType: "SupportTicket",
          targetId: ticket.id,
          targetUserId: adminUserId,
          action: "SUPPORT_TICKET_CREATED",
          metadata: {
            ticketNumber,
            subject: data.subject,
            category: data.category,
            priority: data.priority,
          },
        },
      });
    } catch {
      // Audit failure should not block ticket creation
    }

    return ticket;
  }
}
