import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { homeRouter } from "./home.routes.js";
import { categoryRouter } from "./categories.routes.js";
import { storeRouter } from "./stores.routes.js";
import { productRouter } from "./products.routes.js";
import { offerRouter } from "./offers.routes.js";
import { contactRouter } from "./contact.routes.js";
import { searchRouter } from "./search.routes.js";
import { careersRouter } from "./careers.routes.js";
import { partnersRouter } from "./partners.routes.js";
import { supportRouter } from "./support.routes.js";
import { faqsRouter } from "./faqs.routes.js";
import { newsletterRouter } from "./newsletter.routes.js";

export const v1Router = Router();

// Mount all customer storefront modules under /api/v1
v1Router.use("/health", healthRouter);
v1Router.use("/home", homeRouter);
v1Router.use("/categories", categoryRouter);
v1Router.use("/stores", storeRouter);
v1Router.use("/products", productRouter);
v1Router.use("/offers", offerRouter);
v1Router.use("/contact", contactRouter);
v1Router.use("/search", searchRouter);
v1Router.use("/careers", careersRouter);
v1Router.use("/partners", partnersRouter);
v1Router.use("/support", supportRouter);
v1Router.use("/faqs", faqsRouter);
v1Router.use("/newsletter", newsletterRouter);
