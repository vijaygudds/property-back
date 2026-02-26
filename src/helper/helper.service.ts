import { Injectable } from '@nestjs/common';
import {
    RECURRING_MODE_DAILY,
    RECURRING_MODE_HALF_YEARLY,
    RECURRING_MODE_MONTHLY,
    RECURRING_MODE_QUARTERLY,
    RECURRING_MODE_YEARLY,
} from '../dto/constants';
import { MyDate } from './my-date';
import { format } from 'date-fns';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HelperService {
    private defaultDateInstance: MyDate | null = null;

    private adjustDateToMonthEnd(originalDay: number, date: MyDate): MyDate {
        const lastDayOfTargetMonth = date.lastDateOfMonth().getDateOfMonth();
        const targetDay = Math.min(originalDay, lastDayOfTargetMonth);

        return new MyDate(
            new Date(date.getFullYear(), date.getMonth(), targetDay),
        );
    }

    addPremiumModeInterval(
        date: MyDate,
        premiumMode: string,
        originalDay?: number,
    ): MyDate {
        const dateSystem = date;
        let newDate: MyDate;

        switch (premiumMode) {
            case RECURRING_MODE_YEARLY:
                newDate = dateSystem.addYears(1);
                break;
            case RECURRING_MODE_HALF_YEARLY:
                newDate = dateSystem.addMonths(6);
                break;
            case RECURRING_MODE_QUARTERLY:
                newDate = dateSystem.addMonths(3);
                break;
            case RECURRING_MODE_MONTHLY:
                newDate = dateSystem.addMonths(1);
                break;
            case RECURRING_MODE_DAILY:
                return dateSystem.addDays(1);
            default:
                throw new Error('Invalid Premium Mode');
        }

        // If originalDay is provided, adjust the date to respect the original day or month end
        if (originalDay) {
            return this.adjustDateToMonthEnd(originalDay, newDate);
        }

        return newDate;
    }
    private adjustDateToMonthEndLoan(
        originalDay: number,
        date: MyDate,
    ): MyDate {
        const lastDayOfTargetMonth = date.lastDateOfMonth().getDateOfMonth();

        // If original day was 31 (or 30), we want to get the last day of month
        // for months that don't have that many days
        let targetDay;

        if (originalDay >= 30) {
            // If original day was 30 or 31
            if (originalDay === 31) {
                // For day 31, always get the last day of the month
                targetDay = lastDayOfTargetMonth;
            } else if (originalDay === 30) {
                // For day 30, get the last day if the month has fewer than 30 days
                // otherwise keep it at 30
                targetDay =
                    lastDayOfTargetMonth < 30 ? lastDayOfTargetMonth : 30;
            }
        } else {
            // For days less than 30, just use the original day
            // (still constrained by last day of month for safety)
            targetDay = Math.min(originalDay, lastDayOfTargetMonth);
        }

        return new MyDate(
            new Date(date.getFullYear(), date.getMonth(), targetDay),
        );
    }
    addPremiumModeIntervalLoan(
        date: MyDate,
        premiumMode: string,
        originalDay?: number,
    ): MyDate {
        const dateSystem = date;
        let newDate: MyDate;

        // Store the original day to use for future calculations
        // If originalDay isn't provided, use the date's day or the day we want to target (31)
        const dayToUse = originalDay || dateSystem.getDateOfMonth();

        switch (premiumMode) {
            case RECURRING_MODE_YEARLY:
                newDate = dateSystem.addYears(1);
                break;
            case RECURRING_MODE_HALF_YEARLY:
                newDate = dateSystem.addMonths(6);
                break;
            case RECURRING_MODE_QUARTERLY:
                newDate = dateSystem.addMonths(3);
                break;
            case RECURRING_MODE_MONTHLY:
                newDate = dateSystem.addMonths(1);
                break;
            case RECURRING_MODE_DAILY:
                return dateSystem.addDays(1);
            default:
                throw new Error('Invalid Premium Mode');
        }

        // Get the last day of the new month
        const lastDayOfTargetMonth = newDate.lastDateOfMonth().getDateOfMonth();
        console.log('lastDayOfTargetMonth', lastDayOfTargetMonth);

        // Determine the target day based on original day preference
        let targetDay;

        // If original day was 31, we always want the last day of the month
        if (dayToUse === 31) {
            targetDay = lastDayOfTargetMonth;
        }
        // If original day was 30, use 30 for months with ≥30 days, otherwise use last day
        else if (dayToUse === 30) {
            targetDay = lastDayOfTargetMonth < 30 ? lastDayOfTargetMonth : 30;
        }
        // For all other days, try to keep the same day, but don't exceed month end
        else {
            targetDay = Math.min(dayToUse, lastDayOfTargetMonth);
        }

        // Create new date with the calculated target day
        return new MyDate(
            new Date(newDate.getFullYear(), newDate.getMonth(), targetDay),
        );
    }

    dateSystem(dateInput: Date | string | undefined = undefined): MyDate {
        console.log('dateInput', dateInput);
        if (!dateInput) {
            console.log('in if check dateInput', dateInput);
            if (!this.defaultDateInstance) {
                const nowUtc = new Date();

                // Convert to IST (UTC+5:30)
                const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
                const istDate = new Date(nowUtc.getTime() + istOffset);
                this.defaultDateInstance = new MyDate(
                    format(istDate, 'yyyy-MM-dd'),
                );
            }
            return this.defaultDateInstance;
        }
        return new MyDate(dateInput);
    }

    generateUUID(): string {
        return uuidv4();
    }
}
