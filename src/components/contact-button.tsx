"use client";

import { Mail, X } from "lucide-react";
import { useState } from "react";

export function ContactButton(){
  const [open,setOpen]=useState(false);
  return <>
    <button className="contact-fab" type="button" onClick={()=>setOpen(true)} aria-haspopup="dialog" aria-label="Get in touch"><Mail size={20}/><span>Get in touch</span></button>
    {open&&<div className="contact-overlay" role="presentation" onClick={()=>setOpen(false)}><section className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-title" onClick={event=>event.stopPropagation()}><button className="contact-close" type="button" onClick={()=>setOpen(false)} aria-label="Close contact dialog"><X size={19}/></button><p className="eyebrow">Contact</p><h2 id="contact-title" className="mt-3 text-2xl font-medium">Get in touch</h2><p className="mt-3 leading-6 text-slate-600">For questions or feedback about AIdeaMo, email:</p><a className="contact-email" href="mailto:barnacheajassy@gmail.com">barnacheajassy@gmail.com</a></section></div>}
  </>;
}
