# Blockchain + JWE Secure Data Transfer

## Overview
This project is about making data transfer safe and trustworthy. It uses two main ideas:

- Blockchain makes sure that once information or its reference is recorded, it cannot be secretly changed.  
- JWE (JSON Web Encryption) makes sure the data itself is locked and only the right person can unlock and read it.  

When combined, they give a way to share information that is private, verifiable, and tamper-proof.

---

## Why
In normal systems, encryption may protect privacy but does not guarantee that the data has not been altered. With this approach, the data is encrypted for privacy and also anchored on blockchain for integrity. This means the sender and receiver can trust what they see.  
In industries like healthcare and insurance, trust in reports is a big issue. For example, insurance claim companies can sometimes reduce or reject claims by questioning the authenticity of medical reports. Patients and doctors need a way to prove that reports are genuine and untampered.

---

## Tech Stack
- Frontend: Next.js (React)  
- Encryption: JSON Web Encryption (JWE)  
- Blockchain: Ethereum   
- Deployment: Vercel for hosting the frontend  

---

## Deployment
The frontend is deployed on Vercel. To do this:
1. Push your project to GitHub  
2. Connect the repository to Vercel  
3. Each new push will automatically deploy your changes  
