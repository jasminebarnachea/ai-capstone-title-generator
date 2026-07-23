"use client"; import type { SavedProject } from "@/types"; const KEY="capstoneforge-projects-v1";
export const getProjects=():SavedProject[]=>{try{const p=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(p)?p:[]}catch{return[]}};
export const saveProject=(project:SavedProject)=>{try{const all=getProjects();const index=all.findIndex(x=>x.projectId===project.projectId);if(index>=0)all[index]=project;else all.unshift(project);localStorage.setItem(KEY,JSON.stringify(all));}catch{throw new Error("Your browser could not save this project. Check available storage and try again.")}};
export const removeProject=(id:string)=>{try{localStorage.setItem(KEY,JSON.stringify(getProjects().filter(x=>x.projectId!==id)))}catch{throw new Error("Could not delete this project.")}};
