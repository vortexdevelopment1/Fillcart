import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { homeRouter } from "./home.routes.js";
import { categoryRouter } from "./categories.routes.js";
import { storeRouter } from "./stores.routes.js";
import { productRouter } from "./products.routes.js";
import { offerRouter } from "./offers.routes.js";
import { contactRouter } from "./contact.routes.js";

export const v1Router = Router();

// Mount all customer storefront modules under /api/v1
v1Router.use("/health", healthRouter);
v1Router.use("/home", homeRouter);
v1Router.use("/categories", categoryRouter);
v1Router.use("/stores", storeRouter);
v1Router.use("/products", productRouter);
v1Router.use("/offers", offerRouter);
v1Router.use("/contact", contactRouter);
