const { analyzeIncident } = require('./ai')

const testText = `From: daniellimkahwai@gmail.com
To: customercare.my@dhl.com
Date: 7 May 2026, 3:22 PM
Subject: Wrong item delivered, return rejected twice, original item still missing – waybill MY66123490

Hi DHL Customer Service,

I am writing this email because I have completely run out of options. I have called your hotline 3 times, used live chat twice, and even went to your service point in Damansara Uptown in person last Saturday.

On 3 May a courier came to my house. Inside was not a keyboard. It was a handheld blender still in its original Shopee seller packaging, with a completely different seller's name. Somehow my waybill sticker MY66123490 was on the outside of someone else's parcel.

I called DHL hotline on 3 May. The agent told me this sounds like a mislabelling issue and raised case reference CAS-DHL-220503-01.

FIRST FAILED COLLECTION – 5 MAY: Courier came but said he cannot take the parcel because the system didn't generate a return waybill.

SECOND FAILED COLLECTION – 6 MAY: Different courier came with wrong waybill details and refused to take the item.

The keyboard costs RM389. I have not received it. Nobody has told me where it is.

WHAT I AM REQUESTING:
1. A supervisor or senior case handler to take ownership of this case, not a frontline agent
2. Immediate arrangement for courier collection of the wrong item from my house
3. A clear update on where my actual keyboard (waybill MY66123490) is right now
4. If the keyboard cannot be located, I want to know the compensation or claim process
5. Written response to this email, not a phone call, because I need everything documented

I will be leaving detailed reviews on Google, Shopee, and X (Twitter) if this is not resolved.

Please respond by end of day tomorrow 8 May at the latest.

Daniel Lim Kah Wai
011-29934410
Shah Alam, Selangor`

analyzeIncident(testText).then(result => {
  console.log('\n\n====== RENDERED SUMMARY (plain text preview) ======')
  const plain = result.summary
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  console.log(plain)
  console.log('\nCategory:', result.category)
  console.log('Priority:', result.priority)
})