import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import { env } from './config/env.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { logger } from './config/logger.js';

// Routes
import userRoutes from './modules/users/user.routes.js';
import permissionRoutes from './modules/permissions/permission.routes.js';
import divisionTypeRoutes from './modules/divisionTypes/divisionType.routes.js';
import divisionRoutes from './modules/divisions/division.routes.js';
import machineRoutes from './modules/machines/machine.routes.js';
import meterRoutes from './modules/meters/meter.routes.js';
import parameterRoutes from './modules/parameters/parameter.routes.js';

const app = express();

// Security & basics
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: env.rateLimit.windowMs, max: env.rateLimit.max }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/division-types', divisionTypeRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/meters', meterRoutes);
app.use('/api/parameters', parameterRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler
app.use(errorMiddleware);

export default app;
