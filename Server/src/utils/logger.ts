import loggerService from "../services/loggerService.js";
import type { ActionLog } from "../types/logs.js";
import { LogSeverity, LogEntityType } from "../types/logs.js";
import LogAction from "../types/enums/logActions.js";

type LogInfoParams = {
  userId: string;
  action: LogAction;
  entityType: LogEntityType;
  entityId?: string;
  metadata?: Record<string, any>;
  request_context?: Record<string, any> | null;
};

/**
 * Logic for handling user action logs.
 * This file provides high-level methods to log actions following the required schema.
 */

export const logAction = async (data: ActionLog) => {
  const today = new Date();
  const date = `${today.toDateString()} | ${today.toTimeString().slice(0, 8)}`;
  const log: ActionLog = {
    ...data,
    created_at: data.created_at || date,
  };

  // Pass to the logger service (currently console only)
  await loggerService.print(log);
};

/**
 * Logs a successful user action (INFO severity)
 */
export const logInfo = async (params: LogInfoParams) => {
  await logAction({
    user_id: params.userId,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId || "unknown",
    severity: LogSeverity.INFO,
    metadata: params.metadata || {},
    request_context: params.request_context || null,
  });
};

/**
 * Logs a failed user action or error (ERROR severity)
 */
export const logError = async (params: LogInfoParams) => {
  await logAction({
    user_id: params.userId,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId || "unknown",
    severity: LogSeverity.ERROR,
    metadata: params.metadata || {},
    request_context: params.request_context || null,
  });
};

export default {
  logAction,
  logInfo,
  logError,
};
