import { articleMetadata } from "@/features/company/blog/metadata";
import { bookingDateChangeArticle } from "@/features/company/blog/booking-date-change-content";

export const metadata = articleMetadata(bookingDateChangeArticle);
export { BookingDateChangePage as default } from "@/features/company/blog/booking-date-change-page";
