-- Add SCREEN to ApplicationStatus enum (between APPLIED and INTERVIEW)
ALTER TYPE "ApplicationStatus" ADD VALUE 'SCREEN' BEFORE 'INTERVIEW';
