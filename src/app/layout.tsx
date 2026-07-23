import type { Metadata } from "next"; import siteIcon from "@/components/pictures/siteai.png"; import { ContactButton } from "@/components/contact-button"; import "./globals.css"; import "./mobile.css"; import "../components/contact-button.css";
export const metadata:Metadata={title:"AIdeaMo",description:"AI-powered capstone planning for Filipino IT and CS students",icons:{icon:siteIcon.src}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<ContactButton/></body></html>}
