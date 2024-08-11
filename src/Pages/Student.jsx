import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/component/Header';

export default function StudentShow() {
  return (
    <div className="flex flex-col min-h-dvh">
        <Header/>
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container grid gap-12 px-4 md:px-6">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Steps to Give an Exam</h1>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed">
              Follow these simple steps to successfully complete your exam.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <div className="grid gap-4">
              <img
                src="https://imgs.search.brave.com/N-zTGGSi_BBpdqSNmJ2wHN5aE2kKgMT8uB_ivBziYxo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1wc2Qv/M2QtY29tcHV0ZXIt/d2l0aC1sb2dpbi1w/YWdlLXNjcmVlbi1y/ZWdpc3RyYXRpb24t/cGFnZV8zMzQ1OTYt/MTEzNi5qcGc_c2l6/ZT02MjYmZXh0PWpw/Zw"
                width="360"
                height="240"
                alt="Step 1"
                className="rounded-xl object-cover"
                style={{ aspectRatio: "360/240", objectFit: "cover" }}
              />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Step 1: Register</h3>
                <p className="text-muted-foreground">Create an account on our platform to get started.</p>
              </div>
            </div>
            <div className="grid gap-4">
              <img
                src="Screenshot 2024-08-11 194734.png"
                width="360"
                height="240"
                alt="Step 2"
                className="rounded-xl object-contain"
                style={{ aspectRatio: "360/240", objectFit: "contain" }}
              />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Step 2: Schedule Exam</h3>
                <p className="text-muted-foreground">Select your desired exam date and time.</p>
              </div>
            </div>
            <div className="grid gap-4">
              <img
                src="https://imgs.search.brave.com/4IYttGFoFYY-4d52UK2sDjPG8Lojp4AgPUhQHo0aCfM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdHVk/ZW50cy1yZXNpZGVu/dHMuYWFtYy5vcmcv/c2l0ZXMvZGVmYXVs/dC9maWxlcy9zdHls/ZXMvc2NhbGVfYW5k/X2Nyb3BfODUwX3hf/NDcyL3B1YmxpYy9N/Q0FUX2FjY29tbW9k/YXRpb25zLmpwZz9p/dG9rPTI5SU5BQmo1"
                width="360"
                height="240"
                alt="Step 3"
                className="rounded-xl object-cover"
                style={{ aspectRatio: "360/240", objectFit: "cover" }}
              />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Step 3: Take Exam</h3>
                <p className="text-muted-foreground">Log in and complete your exam on the scheduled date.</p>
              </div>
            </div>
            <div className="grid gap-4">
              <img
                src="https://imgs.search.brave.com/rPt3h5aZyTl8ePcG-fHMV64KMtVHRamlTiHasVyZaXA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2LzE1LzMyLzc4/LzM2MF9GXzYxNTMy/Nzg3OV9hRWhJSEtq/d05NbGF4QlNhYjFK/Mk9vUmN6VGk3Y0c3/aS5qcGc"
                width="360"
                height="240"
                alt="Step 4"
                className="rounded-xl object-cover"
                style={{ aspectRatio: "360/240", objectFit: "cover" }}
              />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Step 4: View Results</h3>
                <p className="text-muted-foreground">Check your exam results on your dashboard.</p>
              </div>
            </div>
            <div className="grid gap-4">
              <img
                src="https://imgs.search.brave.com/uMBcW5lmt07UNWPynz6ZbSuDjcnjHwJ51U3ISbmA2Ac/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTMx/MjkyNDAwOS92ZWN0/b3IvcHJvZmVzc2lv/bmFsLWNlcnRpZmlj/YXRlLW9mLWFwcHJl/Y2lhdGlvbi1nb2xk/ZW4tdGVtcGxhdGUt/ZGVzaWduLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1sTTRY/ZjBKb1dnZ0FrdXp3/N3lvdXd2SkJqdzdo/UVVDMlhaOWpGOHZw/TEJrPQ"
                width="360"
                height="240"
                alt="Step 5"
                className="rounded-xl object-cover"
                style={{ aspectRatio: "360/240", objectFit: "cover" }}
              />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Step 5: Receive Certificate</h3>
                <p className="text-muted-foreground">Download your certificate upon successful completion.</p>
              </div>
            </div>
            <div className="grid gap-4">
              <img
                src="https://imgs.search.brave.com/Ecy5tDqvr6H4DzjCKtn8iDUzb4dUWtojABIcrB8GdwM/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5j/bGlwYXJ0YmVzdC5j/b20vY2xpcGFydHMv/NGliL29BOS80aWJv/QTlFNVQucG5n"
                width="360"
                height="240"
                alt="Step 6"
                className="rounded-xl object-cover"
                style={{ aspectRatio: "360/240", objectFit: "cover" }}
              />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Step 6: Celebrate!</h3>
                <p className="text-muted-foreground">Congratulations on passing your exam!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-muted p-6 md:py-12 w-full">
        <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
          <div className="grid gap-1">
            <h3 className="font-semibold">Exam Center</h3>
            <Link to="#">About Us</Link>
            <Link to="#">Our Team</Link>
            <Link to="#">Careers</Link>
            <Link to="#">News</Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Exams</h3>
            <Link to="#">Professional</Link>
            <Link to="#">Academic</Link>
            <Link to="#">Certification</Link>
            <Link to="#">Language</Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Resources</h3>
            <Link to="#">Blog</Link>
            <Link to="#">Community</Link>
            <Link to="#">Support</Link>
            <Link to="#">FAQs</Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Legal</h3>
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Cookie Policy</Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Contact</h3>
            <Link to="#">Support</Link>
            <Link to="#">Sales</Link>
            <Link to="#">Press</Link>
            <Link to="#">Partnerships</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

