import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { prisma } from "../src/db/prisma.js";

describe("Search, Public Lead Forms & Support APIs", () => {
  const createdCareerIds = [];
  const createdPartnerIds = [];
  const createdSupportIds = [];
  const createdNewsletterEmails = [];

  afterAll(async () => {
    // Cleanup any rows created during tests
    if (createdCareerIds.length > 0 && prisma.careerApplication?.deleteMany) {
      await prisma.careerApplication.deleteMany({
        where: { id: { in: createdCareerIds } },
      }).catch(() => {});
    }

    if (createdPartnerIds.length > 0 && prisma.partnerApplication?.deleteMany) {
      await prisma.partnerApplication.deleteMany({
        where: { id: { in: createdPartnerIds } },
      }).catch(() => {});
    }

    if (createdSupportIds.length > 0 && prisma.supportMessage?.deleteMany) {
      await prisma.supportMessage.deleteMany({
        where: { id: { in: createdSupportIds } },
      }).catch(() => {});
    }

    if (createdNewsletterEmails.length > 0 && prisma.newsletterSubscriber?.deleteMany) {
      await prisma.newsletterSubscriber.deleteMany({
        where: { email: { in: createdNewsletterEmails } },
      }).catch(() => {});
    }
  });

  describe("1. GET /api/v1/search", () => {
    it("should return products, stores, and categories for a valid query", async () => {
      const res = await request(app).get("/api/v1/search?q=fresh&limit=5");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();

      const { products, stores, categories } = res.body.data;
      expect(Array.isArray(products)).toBe(true);
      expect(Array.isArray(stores)).toBe(true);
      expect(Array.isArray(categories)).toBe(true);

      if (products.length > 0) {
        expect(products[0]).toHaveProperty("slug");
        expect(products[0]).toHaveProperty("name");
      }
      if (stores.length > 0) {
        expect(stores[0]).toHaveProperty("slug");
        expect(stores[0]).toHaveProperty("name");
      }
    });

    it("should return 400 when search query 'q' is shorter than 2 characters", async () => {
      const res = await request(app).get("/api/v1/search?q=a");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
      expect(res.body.error.message).toMatch(/at least 2 characters/i);
    });

    it("should return 400 when search query 'q' is missing", async () => {
      const res = await request(app).get("/api/v1/search");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("2. GET /api/v1/search/suggestions", () => {
    it("should return up to 8 short suggestions with name, type, and slug", async () => {
      const res = await request(app).get("/api/v1/search/suggestions?q=fresh");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(8);

      if (res.body.data.length > 0) {
        const item = res.body.data[0];
        expect(item).toHaveProperty("name");
        expect(item).toHaveProperty("type");
        expect(item).toHaveProperty("slug");
        expect(["product", "store", "category"]).toContain(item.type);
      }
    });

    it("should return 400 when suggestions query 'q' is missing", async () => {
      const res = await request(app).get("/api/v1/search/suggestions");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("3. GET /api/v1/careers/openings", () => {
    it("should return all active job openings", async () => {
      const res = await request(app).get("/api/v1/careers/openings");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(4);

      const firstJob = res.body.data[0];
      expect(firstJob).toHaveProperty("id");
      expect(firstJob).toHaveProperty("title");
      expect(firstJob).toHaveProperty("department");
      expect(firstJob).toHaveProperty("location");
      expect(firstJob).toHaveProperty("requirements");
    });

    it("should filter job openings by department", async () => {
      const res = await request(app).get("/api/v1/careers/openings?department=Engineering");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      for (const job of res.body.data) {
        expect(job.department).toBe("Engineering");
      }
    });
  });

  describe("4. POST /api/v1/careers/applications", () => {
    it("should successfully submit a career application with 201 status", async () => {
      const payload = {
        fullName: "Rohan Verma",
        email: "rohan.verma@example.com",
        phone: "+91 98765 12345",
        jobTitle: "Senior Geospatial & Dispatch Engineer",
        department: "Engineering",
        experience: "4-7 Years",
        resumeName: "rohan_verma_resume.pdf",
        coverNote: "Excited to contribute to Fillcart's hyperlocal dispatch algorithms.",
      };

      const res = await request(app)
        .post("/api/v1/careers/applications")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("message");

      if (res.body.data.id && res.body.data.id !== "spam-filtered") {
        createdCareerIds.push(res.body.data.id);
      }
    });

    it("should return 400 for invalid email or phone", async () => {
      const res = await request(app)
        .post("/api/v1/careers/applications")
        .send({
          fullName: "Rohan Verma",
          email: "not-an-email",
          phone: "123",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 400 when required full name is missing", async () => {
      const res = await request(app)
        .post("/api/v1/careers/applications")
        .send({
          email: "rohan@example.com",
          phone: "+91 98765 12345",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("5. POST /api/v1/partners/vendor-applications", () => {
    it("should submit a vendor application with 201 status", async () => {
      const payload = {
        storeName: "Sharma Super Daily",
        ownerName: "Mukesh Sharma",
        phone: "+91 98111 22233",
        email: "mukesh.sharma@example.com",
        category: "grocery",
        city: "Indore",
        address: "Shop 14, Scheme 78, Vijay Nagar, Indore",
      };

      const res = await request(app)
        .post("/api/v1/partners/vendor-applications")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("message");

      if (res.body.data.id && res.body.data.id !== "spam-filtered") {
        createdPartnerIds.push(res.body.data.id);
      }
    });

    it("should return 400 when required fields are missing", async () => {
      const res = await request(app)
        .post("/api/v1/partners/vendor-applications")
        .send({
          storeName: "Test Store",
          // missing ownerName, phone, email, address, city
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("6. POST /api/v1/partners/rider-applications", () => {
    it("should submit a rider application with 201 status", async () => {
      const payload = {
        fullName: "Deepak Choudhary",
        phone: "+91 98222 33445",
        email: "deepak.rider@example.com",
        city: "Indore",
        vehicleType: "bike",
        hasLicense: "yes",
      };

      const res = await request(app)
        .post("/api/v1/partners/rider-applications")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("message");

      if (res.body.data.id && res.body.data.id !== "spam-filtered") {
        createdPartnerIds.push(res.body.data.id);
      }
    });

    it("should return 400 when phone number or vehicleType is invalid/missing", async () => {
      const res = await request(app)
        .post("/api/v1/partners/rider-applications")
        .send({
          fullName: "Deepak",
          email: "deepak@example.com",
          phone: "abc",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("7. POST /api/v1/support/messages", () => {
    it("should create a support ticket with 201 status and ticketNumber", async () => {
      const payload = {
        category: "Orders & Delivery",
        subject: "Delayed refund for order FC-10492",
        orderId: "FC-10492",
        description: "My order was cancelled due to out of stock item but refund is pending.",
        fullName: "Sunita Roy",
        email: "sunita.roy@example.com",
      };

      const res = await request(app)
        .post("/api/v1/support/messages")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("ticketNumber");
      expect(res.body.data.ticketNumber).toMatch(/^TKT-/);

      if (res.body.data.id && res.body.data.id !== "spam-filtered") {
        createdSupportIds.push(res.body.data.id);
      }
    });

    it("should return 400 when description is too short (< 5 chars)", async () => {
      const res = await request(app)
        .post("/api/v1/support/messages")
        .send({
          category: "Other Query",
          subject: "Help",
          description: "Hi",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("8. GET /api/v1/faqs", () => {
    it("should return all FAQ categories and their questions", async () => {
      const res = await request(app).get("/api/v1/faqs");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      const firstCat = res.body.data[0];
      expect(firstCat).toHaveProperty("id");
      expect(firstCat).toHaveProperty("label");
      expect(firstCat).toHaveProperty("items");
      expect(Array.isArray(firstCat.items)).toBe(true);
    });

    it("should filter FAQs by category", async () => {
      const res = await request(app).get("/api/v1/faqs?category=orders");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].id).toBe("orders");
    });

    it("should search FAQs matching query 'refund'", async () => {
      const res = await request(app).get("/api/v1/faqs?q=refund");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("9. POST /api/v1/newsletter/subscribe", () => {
    it("should register a newsletter subscription with 201 status", async () => {
      const testEmail = `subscriber_${Date.now()}@example.com`;
      const res = await request(app)
        .post("/api/v1/newsletter/subscribe")
        .send({ email: testEmail });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.email).toBe(testEmail);

      createdNewsletterEmails.push(testEmail);
    });

    it("should return 400 for an invalid email", async () => {
      const res = await request(app)
        .post("/api/v1/newsletter/subscribe")
        .send({ email: "invalid-email-format" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });
});
