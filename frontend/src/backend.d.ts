import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface IncidentUpdate {
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface IncidentDTO {
    id: string;
    status: Status;
    title: string;
    affectedService: string;
    createdAt: Time;
    description: string;
    updatedAt: Time;
    updates: Array<IncidentUpdate>;
    severity: Severity;
}
export enum Severity {
    major = "major",
    minor = "minor",
    critical = "critical",
    informational = "informational"
}
export enum Status {
    resolved = "resolved",
    investigating = "investigating",
    monitoring = "monitoring",
    identified = "identified"
}
export interface backendInterface {
    addUpdate(incidentId: string, title: string, description: string, affectedService: string, severity: Severity, message: string): Promise<IncidentDTO>;
    changeStatus(incidentId: string, title: string, description: string, affectedService: string, severity: Severity, newStatus: string): Promise<IncidentDTO>;
    createIncident(id: string, title: string, description: string, affectedService: string, severity: Severity): Promise<IncidentDTO>;
    getAllIncidents(): Promise<Array<IncidentDTO>>;
    getIncident(incidentId: string): Promise<IncidentDTO | null>;
    isIdAlreadyUsed(id: string): Promise<boolean>;
}
