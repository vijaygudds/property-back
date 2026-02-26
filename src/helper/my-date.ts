import { addDays, addMonths, addYears, format, lastDayOfMonth } from 'date-fns';

export class MyDate {
    private date: Date;

    constructor(dateInput: Date | string) {
        this.date = this.getISTDate(dateInput);
    }

    private getISTDate(dateInput: Date | string): Date {
        if (typeof dateInput === 'string' || !dateInput) {
            return new Date(
                new Date(dateInput).toLocaleString('en-US', {
                    timeZone: 'Asia/Kolkata',
                }),
            );
        } else {
            return new Date(
                dateInput.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            );
        }
    }

    addDays(days: number): MyDate {
        const newDate = addDays(this.date, days);
        return new MyDate(newDate);
    }
    firstDateOfMonth(): MyDate {
        const newDate = new Date(
            this.date.getFullYear(),
            this.date.getMonth(),
            1,
        );
        return new MyDate(newDate);
    }
    lastDateOfMonth(): MyDate {
        const newDate = lastDayOfMonth(this.date);
        return new MyDate(newDate);
    }

    addMonths(months: number): MyDate {
        const newDate = addMonths(this.date, months);
        return new MyDate(newDate);
    }

    addYears(years: number): MyDate {
        const newDate = addYears(this.date, years);
        return new MyDate(newDate);
    }

    getDate(): Date {
        return new Date(this.date);
    }

    toString(onlyDate = true): string {
        return format(
            this.date,
            onlyDate ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss',
        );
    }
    toStringFormatDate(onlyDate = true): string {
        return format(
            this.date,
            onlyDate ? 'dd-MM-yyyy' : 'dd-MM-yyyy HH:mm:ss',
        );
    }

    // daysDifference(date: Date): number {
    //     return Math.floor(
    //         (this.date.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    //     );
    // }
    daysDifference(date: Date): number {
        // Extract year, month, and day from both dates
        const currentDateOnly = new Date(
            this.date.getFullYear(),
            this.date.getMonth(),
            this.date.getDate(),
        );
        const compareDateOnly = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
        );

        // Calculate the difference in time and convert it to days
        return Math.floor(
            (currentDateOnly.getTime() - compareDateOnly.getTime()) /
                (1000 * 60 * 60 * 24),
        );
    }

    monthsDifference(date: Date): number {
        const months = (this.date.getFullYear() - date.getFullYear()) * 12;
        return months + this.date.getMonth() - date.getMonth();
    }

    yearsDifference(date: Date): number {
        return this.date.getFullYear() - date.getFullYear();
    }

    getFullYear(): number {
        return this.date.getFullYear();
    }

    getMonth(): number {
        return this.date.getMonth();
    }

    getDateOfMonth(): number {
        return this.date.getDate();
    }

    isLastDayOfMonth(): boolean {
        const lastDate = lastDayOfMonth(this.date);
        return this.date.getDate() === lastDate.getDate();
    }

    getFinancialYear(startEnd: 'start' | 'end' | 'both' = 'both'): any {
        const year = this.getFullYear();
        const month = this.getMonth() + 1; // JavaScript months are 0-indexed

        let financialYearStartYear: number;
        let financialYearEndYear: number;

        // Determine the financial year start and end year
        if (month >= 1 && month <= 3) {
            financialYearStartYear = year - 1;
            financialYearEndYear = year;
        } else {
            financialYearStartYear = year;
            financialYearEndYear = year + 1;
        }

        // Format the financial year start and end dates
        const financialYearStartDate = format(
            new Date(financialYearStartYear, 3, 1),
            'yyyy-MM-dd',
        );
        const financialYearEndDate = format(
            new Date(financialYearEndYear, 2, 31),
            'yyyy-MM-dd',
        );

        // Return based on the 'startEnd' parameter
        switch (startEnd) {
            case 'start':
                return financialYearStartDate;
            case 'end':
                return financialYearEndDate;
            case 'both':
                return {
                    startDate: financialYearStartDate,
                    endDate: financialYearEndDate,
                };
        }
    }

    // NEW METHOD TO ADD
    /**
     * Returns the financial year as a string, e.g., "2023-2024".
     * The financial year in India runs from April 1st to March 31st.
     * @returns {string} The financial year string.
     */
    getFinancialYearString(): string {
        const year = this.getFullYear();
        const month = this.getMonth() + 1; // JavaScript months are 0-indexed

        let financialYearStartYear: number;

        // If the month is Jan, Feb, or Mar, the financial year started in the *previous* calendar year.
        if (month <= 3) {
            financialYearStartYear = year - 1;
        } else {
            // Otherwise, it started in the current calendar year.
            financialYearStartYear = year;
        }

        const financialYearEndYear = financialYearStartYear + 1;

        return `${financialYearStartYear}-${financialYearEndYear}`;
    }

    getFinancialQuarter(startEnd: 'start' | 'end' | 'both' = 'both'): any {
        const year = this.getFullYear();
        const month = this.getMonth() + 1; // JavaScript months are 0-indexed

        let qMonthStart: Date;
        let qMonthEnd: Date;

        // Determine the quarter's start and end months
        if (month >= 1 && month <= 3) {
            qMonthStart = new Date(year, 0, 1); // January 1st
            qMonthEnd = new Date(year, 2, 31); // March 31st
        } else if (month >= 4 && month <= 6) {
            qMonthStart = new Date(year, 3, 1); // April 1st
            qMonthEnd = new Date(year, 5, 30); // June 30th
        } else if (month >= 7 && month <= 9) {
            qMonthStart = new Date(year, 6, 1); // July 1st
            qMonthEnd = new Date(year, 8, 30); // September 30th
        } else {
            qMonthStart = new Date(year, 9, 1); // October 1st
            qMonthEnd = new Date(year, 11, 31); // December 31st
        }

        // Format the quarter start and end dates
        const formattedQMonthStart = format(qMonthStart, 'yyyy-MM-dd');
        const formattedQMonthEnd = format(qMonthEnd, 'yyyy-MM-dd');

        // Return based on the 'startEnd' parameter
        switch (startEnd) {
            case 'start':
                return formattedQMonthStart;
            case 'end':
                return formattedQMonthEnd;
            case 'both':
                return {
                    startDate: formattedQMonthStart,
                    endDate: formattedQMonthEnd,
                };
        }
    }

    isFinancialYearStart(): boolean {
        const financialYearStart = this.getFinancialYear('start');
        return this.toString() === financialYearStart;
    }

    isFinancialYearEnd(): boolean {
        const financialYearEnd = this.getFinancialYear('end');
        return this.toString() === financialYearEnd;
    }

    isQuarterEnd(): boolean {
        const quarterEnd = this.getFinancialQuarter('end');
        return this.toString() === quarterEnd;
    }

    isHalfYearDone(): boolean {
        const month = this.getMonth() + 1; // JavaScript months are 0-indexed
        const date = this.getDateOfMonth();

        if (month === 3 && date === 31) {
            return true;
        } else return month === 9 && date === 30;
    }

    // const date1 = new MyDate('2023-01-01');
    // const date2 = new MyDate('2023-02-01');
    // console.log(date1.isSmallerThan(date2)); // true
    // console.log(date2.isSmallerThan(date1)); // false
    isSmallerThan(other: MyDate): boolean {
        return this.date < other.getDate();
    }
    isSmallerThanOrEqual(otherDate: Date): boolean {
        return this.date.getTime() <= otherDate.getTime();
    }

    isSameMonthAs(otherDate: MyDate): boolean {
        return (
            this.date.getFullYear() === otherDate.getFullYear() &&
            this.date.getMonth() === otherDate.getMonth()
        );
    }
}
