export const deckName = "Cards Against Developers" as const;
export const deckVersion = "cad-535b-883w-v1" as const;

export type BlackCard = {
  id: string;
  text: string;
  pick: number;
};

export type WhiteCard = {
  id: string;
  text: string;
};

export const blackCards: readonly BlackCard[] = [
  {
    id: "black-4ff1dc4290c4e7da",
    text: '"But online I read that _____."',
    pick: 1
  },
  {
    id: "black-6113e579dcf82ef8",
    text: '"Hey, _____ is down. Can you fix it?"',
    pick: 1
  },
  {
    id: "black-de48221b455c50f0",
    text: '"Our release schedule doesn\'t have time for _____."',
    pick: 1
  },
  {
    id: "black-bebabcf0d733b86d",
    text: '"There was no good solution for _____, so we built our own."',
    pick: 1
  },
  {
    id: "black-0305460030676a64",
    text: "...and then there was the time I found _____ on the root partition.",
    pick: 1
  },
  {
    id: "black-2ec7a8b88838c2d9",
    text: "/dev/_____: Device is busy",
    pick: 1
  },
  {
    id: "black-9639f018e28d7190",
    text: '10 PRINT "_____"; GOTO 10',
    pick: 1
  },
  {
    id: "black-b935a070e8fd9b20",
    text: "11 reasons to _____. Nr 5 will surprise you.",
    pick: 1
  },
  {
    id: "black-d73ae73b604fab5f",
    text: "90% of everything is _____.",
    pick: 1
  },
  {
    id: "black-340163dac7c9b30c",
    text: "100% government funded _____!",
    pick: 1
  },
  {
    id: "black-f90e554dfafbf2da",
    text: "140 characters is just enough to explain _____.",
    pick: 1
  },
  {
    id: "black-17b77aafa3149f87",
    text: "A Beowulf cluster of _____.",
    pick: 1
  },
  {
    id: "black-d8cc43cf2b69100b",
    text: "A lot of disk space is needed for _____",
    pick: 1
  },
  {
    id: "black-0ed81b0f5e4ddcff",
    text: "A neckbeard made of _____.",
    pick: 1
  },
  {
    id: "black-9770d9b9bfb33706",
    text: "A soiled napkin with the contents of _____ scribbled on it",
    pick: 1
  },
  {
    id: "black-c14ff76ebae2e8e7",
    text: "Accidental _____.",
    pick: 1
  },
  {
    id: "black-8e46a6dbad5d359e",
    text: "According to support, users are confused by _____.",
    pick: 1
  },
  {
    id: "black-b6ae2a02f834e1ac",
    text: "According to the AI, the root cause was _____.",
    pick: 1
  },
  {
    id: "black-cf2341c0f7f1b32f",
    text: "After _____ came up, the retrospective really went downhill.",
    pick: 1
  },
  {
    id: "black-3cd1f1ee76a3548b",
    text: "After adding AI, our product now excels at _____.",
    pick: 1
  },
  {
    id: "black-a6d7e4b23cca6133",
    text: "After successfully selling my company I now _____.",
    pick: 1
  },
  {
    id: "black-2901b192ba49c67d",
    text: "After ten years working as a developer, I am addicted to _____.",
    pick: 1
  },
  {
    id: "black-85f7da8b4ae7218d",
    text: "All that we had to do to halve our response times was implement _____",
    pick: 1
  },
  {
    id: "black-bce416f5d8f71bf1",
    text: "Amazon Elastic _____",
    pick: 1
  },
  {
    id: "black-0b040e928724dd28",
    text: "Amazon built a datacenter on the moon to lessen the risk of _____ causing problems.",
    pick: 1
  },
  {
    id: "black-749f40c9be2b186c",
    text: "Amazon does _____, why can't we?",
    pick: 1
  },
  {
    id: "black-3eeb4d1ab3686027",
    text: "An error occurred: E_____",
    pick: 1
  },
  {
    id: "black-f940e41353adf974",
    text: "Apple just patented _____.",
    pick: 1
  },
  {
    id: "black-065f22e5397fa4e5",
    text: "As a hobby project I _____.",
    pick: 1
  },
  {
    id: "black-682da87e3720775a",
    text: "Ask Me Anything about _____.",
    pick: 1
  },
  {
    id: "black-145264cd46bc3729",
    text: "Asynchronous REST API calls are the solution to _____",
    pick: 1
  },
  {
    id: "black-dc1dc61f28cdbd50",
    text: "At 3 AM, every dashboard eventually becomes _____.",
    pick: 1
  },
  {
    id: "black-7ca2f1785ca76b66",
    text: "At our startup, product-market fit means _____.",
    pick: 1
  },
  {
    id: "black-d5a22f3633f5df90",
    text: "At this point, our monitoring strategy is mostly _____.",
    pick: 1
  },
  {
    id: "black-ce19692599fe40db",
    text: 'Being "customer obsessed" now apparently includes _____.',
    pick: 1
  },
  {
    id: "black-e6fabc5d6290aeb6",
    text: "But Google is using _____ so we should too!",
    pick: 1
  },
  {
    id: "black-8ca2746a5d9eae45",
    text: 'By "lightweight process" management apparently meant _____.',
    pick: 1
  },
  {
    id: "black-9f02e8bd603c1d89",
    text: "C will finally be displaced by _____",
    pick: 1
  },
  {
    id: "black-d99511920a63db5b",
    text: "C-x; C-_____",
    pick: 1
  },
  {
    id: "black-9db69e34993775b6",
    text: "CI said _____, so naturally we shipped anyway.",
    pick: 1
  },
  {
    id: "black-1ba72f107931f269",
    text: "CTO energy is mostly _____ plus a Patagonia vest.",
    pick: 1
  },
  {
    id: "black-773056d96d0501c2",
    text: "Called on account of _____.",
    pick: 1
  },
  {
    id: "black-68030ca20686830d",
    text: "Can anyone help me get _____ running on Cisco IOS?",
    pick: 1
  },
  {
    id: "black-6c9bafe3c67a0a63",
    text: "Chef convergence failed due to _____.",
    pick: 1
  },
  {
    id: "black-bea21c1bb629b8e3",
    text: "Circular imports import _____.",
    pick: 1
  },
  {
    id: "black-797a1c1ea468830f",
    text: "Compliance asked whether we had controls for _____.",
    pick: 1
  },
  {
    id: "black-624576c1265e5a5b",
    text: "Compliance got nervous when the model suggested _____.",
    pick: 1
  },
  {
    id: "black-186d0d04400e54f0",
    text: "Continuous _____.",
    pick: 1
  },
  {
    id: "black-74d4db221138746e",
    text: "Conway's Game of _____.",
    pick: 1
  },
  {
    id: "black-63e1ea7fd35964e5",
    text: "Could you just push this update for _____?  It should be a no-op.",
    pick: 1
  },
  {
    id: "black-85a4a007e5773958",
    text: "Couldn't we use _____?",
    pick: 1
  },
  {
    id: "black-59b12b8d7862d2f3",
    text: "Crossing _____ could lead to total protonic reversal.",
    pick: 1
  },
  {
    id: "black-6ccf2058e7e17825",
    text: "Customer success promised the client _____ by Friday.",
    pick: 1
  },
  {
    id: "black-a8da5b57ed83bb08",
    text: "Customers always complain about _____ in our software.",
    pick: 1
  },
  {
    id: "black-529e2f95a8a49de3",
    text: "DB tuning with _____.",
    pick: 1
  },
  {
    id: "black-948e48312041e51d",
    text: "Deploying my application in _____.",
    pick: 1
  },
  {
    id: "black-05d5aec1f3d2f057",
    text: "DevOps: Now with 100% more _____!",
    pick: 1
  },
  {
    id: "black-2d672e6e8fb3909d",
    text: "Developers do not get access to production machines, because of _____.",
    pick: 1
  },
  {
    id: "black-df080c8d942f576f",
    text: "Developers need access to production machines because _____.",
    pick: 1
  },
  {
    id: "black-6bad26d4e2d404c2",
    text: "Did you know that we have _____ on pager rotation?",
    pick: 1
  },
  {
    id: "black-03463513dfad2c0c",
    text: "Did you try _____ yet?",
    pick: 1
  },
  {
    id: "black-51528752440dad7f",
    text: "Doge _____.",
    pick: 1
  },
  {
    id: "black-b26047c866c0eeef",
    text: "During the incident review, everyone quietly blamed _____.",
    pick: 1
  },
  {
    id: "black-aab023c97fa225b3",
    text: "During the outage, our disaster recovery plan was mostly _____.",
    pick: 1
  },
  {
    id: "black-cdb6a6fecd545e5a",
    text: "ERROR: _____ NOT FOUND",
    pick: 1
  },
  {
    id: "black-18d01c15a9f01a3c",
    text: "Elastic support asked for logs, but all we had was _____.",
    pick: 1
  },
  {
    id: "black-5d2f90fe6d982900",
    text: "Employees must _____ before returning to work.",
    pick: 1
  },
  {
    id: "black-d4590e83a5750804",
    text: "End-to-end _____.",
    pick: 1
  },
  {
    id: "black-c282fa6792171ed0",
    text: "Enterprise _____ in the cloud.",
    pick: 1
  },
  {
    id: "black-5e8e36c30185d0fa",
    text: "Enterprise-ready _____.",
    pick: 1
  },
  {
    id: "black-5b987c4a6a00a676",
    text: "Epic yak-shave caused by _____.",
    pick: 1
  },
  {
    id: "black-1a0955b12c34f443",
    text: "Etsy says we should _____ everything.",
    pick: 1
  },
  {
    id: "black-699db9bce1a657e0",
    text: "Every Copilot suggestion eventually converges on _____.",
    pick: 1
  },
  {
    id: "black-bef586c393f35e52",
    text: "Every retro eventually turns into a discussion about _____.",
    pick: 1
  },
  {
    id: "black-0c38f5c8803f278c",
    text: "Every startup eventually pivots from AI to _____.",
    pick: 1
  },
  {
    id: "black-343e654c70987d1d",
    text: "Every time you allocate you have to _____ when you're done",
    pick: 1
  },
  {
    id: "black-66b15a031b5af708",
    text: "Everything changed when someone suggested _____ during grooming.",
    pick: 1
  },
  {
    id: "black-361bee26f131e716",
    text: "Excel should be used for _____ more often.",
    pick: 1
  },
  {
    id: "black-b552bdb204e91d50",
    text: "Facebook changed their profiles today because _____.",
    pick: 1
  },
  {
    id: "black-14652681d0351121",
    text: "Finance asked why our cloud spend keeps growing. I said _____.",
    pick: 1
  },
  {
    id: "black-d6dcb4a49bdd2f00",
    text: "Fixing bugs by _____.",
    pick: 1
  },
  {
    id: "black-60cbcab19c7119b7",
    text: "For relaxing I do _____.",
    pick: 1
  },
  {
    id: "black-661d7587c6502f79",
    text: "Free as in _____.",
    pick: 1
  },
  {
    id: "black-4bcf551cfb4d7ea6",
    text: "Glitter-bombed with _____.",
    pick: 1
  },
  {
    id: "black-03c86125710e0e4b",
    text: "Good enough for _____ work",
    pick: 1
  },
  {
    id: "black-87e2347f359c0d4a",
    text: "Hack _____ into Redis.",
    pick: 1
  },
  {
    id: "black-b9f17fd77ffe42fa",
    text: "High quality software is made with _____",
    pick: 1
  },
  {
    id: "black-971b3eed746ebcec",
    text: "How did _____ ever work?",
    pick: 1
  },
  {
    id: "black-a733c17391753e3a",
    text: "How do I even _____ ?",
    pick: 1
  },
  {
    id: "black-4fd35270c7f90d69",
    text: "How even is _____ formed?",
    pick: 1
  },
  {
    id: "black-c3e322d1c0157128",
    text: "How hard could it be to port Linux to _____?",
    pick: 1
  },
  {
    id: "black-4cd8e19c1b972285",
    text: "I AM working, I'm waiting for the _____ run to finish.",
    pick: 1
  },
  {
    id: "black-361fd80ade4c8d40",
    text: "I am using _____ for my monolith.",
    pick: 1
  },
  {
    id: "black-f6dc2cf87392fbfe",
    text: "I asked my boss for a raise due to _____.",
    pick: 1
  },
  {
    id: "black-9e0f240b74e564fa",
    text: "I asked the AI for help and it confidently delivered _____.",
    pick: 1
  },
  {
    id: "black-28fe027b91e3b203",
    text: "I asked the coding assistant for a small refactor and it delivered _____.",
    pick: 1
  },
  {
    id: "black-4cd1974166f7116e",
    text: "I assure you _____ is secure!",
    pick: 1
  },
  {
    id: "black-9766c6d989a2c7ea",
    text: "I bet if we switch to _____ it will just work",
    pick: 1
  },
  {
    id: "black-5cb3de8cb49c306c",
    text: "I can haz _____.",
    pick: 1
  },
  {
    id: "black-154d8cb5ddab97a2",
    text: "I can no longer tell whether _____ was written by a junior dev or an LLM.",
    pick: 1
  },
  {
    id: "black-e4e4f58cdf71ebab",
    text: "I can't believe you're still using _____.",
    pick: 1
  },
  {
    id: "black-abd4bb49b9956b0c",
    text: "I can't wait until we no longer use _____",
    pick: 1
  },
  {
    id: "black-e811e884db66a20a",
    text: "I cannot wait until someone makes a _____ cluster out of these.",
    pick: 1
  },
  {
    id: "black-bdab588a9c5e27d7",
    text: "I could hire a _____ to do your job!",
    pick: 1
  },
  {
    id: "black-24e95c8bc243aa1a",
    text: "I cut-and-pasted this StackOverflow code for my _____.",
    pick: 1
  },
  {
    id: "black-88774ff682e83533",
    text: "I declined the pull request because of _____.",
    pick: 1
  },
  {
    id: "black-ab3bea857bd8febb",
    text: "I don't always test my code, but when I do I do it in _____.",
    pick: 1
  },
  {
    id: "black-2cc44ec8148a0cf8",
    text: "I don't get paid because of _____.",
    pick: 1
  },
  {
    id: "black-5edb0316b3068931",
    text: "I don't have any UNIX Beards in stock, but we do have  _____",
    pick: 1
  },
  {
    id: "black-72eb5ae4d0243682",
    text: "I don't need backups, I have _____.",
    pick: 1
  },
  {
    id: "black-c12ce369f1256021",
    text: "I ended up having to buy a replacement _____ on eBay.",
    pick: 1
  },
  {
    id: "black-85c637dfa201c348",
    text: "I filed a bug on _____.",
    pick: 1
  },
  {
    id: "black-f3c74b945941c5f8",
    text: "I find Java to be way too _____.",
    pick: 1
  },
  {
    id: "black-aaf20864ecc78978",
    text: "I found a Samba share full of _____",
    pick: 1
  },
  {
    id: "black-ca18e5e16b299104",
    text: "I got paged at 3am because of _____.",
    pick: 1
  },
  {
    id: "black-1c431c3665595e1b",
    text: "I grabbed _____ on my way out the door after our paychecks bounced and management stopped answering their phones.",
    pick: 1
  },
  {
    id: "black-9dc94c8275326094",
    text: "I installed _____ by accident.",
    pick: 1
  },
  {
    id: "black-17db77ce0d8b95a1",
    text: "I integrated _____ into my DevSecOps pipeline.",
    pick: 1
  },
  {
    id: "black-2828bbee78e2619c",
    text: "I just finished working on my rocket powered _____.",
    pick: 1
  },
  {
    id: "black-ffaadf7f9dcca48d",
    text: "I just finished writing an API for _____.",
    pick: 1
  },
  {
    id: "black-6dcd3c5b0ef6a26d",
    text: "I laughed when they said I'd be on call 24/7 but wouldn't receive a stipend for _____.",
    pick: 1
  },
  {
    id: "black-60a2be90e06c69f6",
    text: "I like to turn up to investor meetings _____.",
    pick: 1
  },
  {
    id: "black-ad885e3d7d4b5c65",
    text: "I made a new editor, better than vim and emacs. It's called _____",
    pick: 1
  },
  {
    id: "black-615c52f90ec5de90",
    text: "I need a webinar like I need _____.",
    pick: 1
  },
  {
    id: "black-4a91525fd456b9e1",
    text: "I opened the server cabinet and it was full of _____.",
    pick: 1
  },
  {
    id: "black-dd700977de2be617",
    text: "I put _____ on the scripts to make it run faster.",
    pick: 1
  },
  {
    id: "black-bffb2c4756439884",
    text: "I regret making _____ configurable.",
    pick: 1
  },
  {
    id: "black-db208ba95ab1d3eb",
    text: "I spent my last salary on _____.",
    pick: 1
  },
  {
    id: "black-a7bca455b948d43c",
    text: "I successfully tested _____.",
    pick: 1
  },
  {
    id: "black-e06a2ecaf9618e95",
    text: "I switched to Linux because of _____.",
    pick: 1
  },
  {
    id: "black-96aee164b61b3630",
    text: "I think maybe I'll leave _____ off my resumé.",
    pick: 1
  },
  {
    id: "black-2a5d0246895e44dc",
    text: "I thought you said _____ was secure?",
    pick: 1
  },
  {
    id: "black-93f2683f0d75d191",
    text: "I used AI to explain the codebase and got _____.",
    pick: 1
  },
  {
    id: "black-d2c7a43f669a5588",
    text: "I was 6 beers in when I got the pager alert that _____ was down.",
    pick: 1
  },
  {
    id: "black-33a5b533fbca5fff",
    text: "I was added to the incident channel because of my expertise in _____.",
    pick: 1
  },
  {
    id: "black-07551f4be4eb82d9",
    text: "I was hired to maintain this 20 year old script that runs our critical _____ infrastructure.",
    pick: 1
  },
  {
    id: "black-3463f280ecdc9b64",
    text: "I will replace you with a very small _____.",
    pick: 1
  },
  {
    id: "black-73ef69684dbf7275",
    text: "I would sell my shares of the company for _____.",
    pick: 1
  },
  {
    id: "black-b2b73e1867450c18",
    text: "I'll just have Ops spin up a couple of _____ environments.",
    pick: 1
  },
  {
    id: "black-d9c8bba9f65ee183",
    text: "I'm just finishing up my manifesto on _____.",
    pick: 1
  },
  {
    id: "black-f15a27c7e9749828",
    text: "I'm pretty sure _____ isn't thread safe",
    pick: 1
  },
  {
    id: "black-782fe0a21beda400",
    text: "I'm writing my next IRC bot with _____.",
    pick: 1
  },
  {
    id: "black-c0301093794b9391",
    text: "I've received a Microsoft MVP Award for _____",
    pick: 1
  },
  {
    id: "black-d978c6eeaa249ea0",
    text: "If _____ is the answer, you are asking the wrong question.",
    pick: 1
  },
  {
    id: "black-0cb4f0b91c88ab00",
    text: "If the cluster survives this quarter, it will be despite _____.",
    pick: 1
  },
  {
    id: "black-283680c51258bb4a",
    text: "If this company runs out of runway, at least we still have _____.",
    pick: 1
  },
  {
    id: "black-331878a3f40ff3b0",
    text: "If we make this deadline, Management has promised us _____.",
    pick: 1
  },
  {
    id: "black-b46e560f7a6c9c57",
    text: "If we're all going to get fired, let's get fired for _____.",
    pick: 1
  },
  {
    id: "black-b67df70a617835f2",
    text: "If you're _____, you're gonna have a bad time.",
    pick: 1
  },
  {
    id: "black-6f3ba49d9f6fd1cc",
    text: "Implementing _____ should take only 2 lines of code.",
    pick: 1
  },
  {
    id: "black-1626a80b853f98d2",
    text: "In order to improve security, we're upgrading to _____.",
    pick: 1
  },
  {
    id: "black-27f568dde951f40c",
    text: 'In startup terms, "moving fast" usually means _____.',
    pick: 1
  },
  {
    id: "black-4dbd7687e93f0853",
    text: "Install _____",
    pick: 1
  },
  {
    id: "black-1ea750c1ffa4a437",
    text: "Investor confidence was briefly restored by _____.",
    pick: 1
  },
  {
    id: "black-14b296e1f2158ac3",
    text: "Is _____ something we need to optimize for?",
    pick: 1
  },
  {
    id: "black-bd4109166b69de0b",
    text: "It compiles _____ to JavaScript.",
    pick: 1
  },
  {
    id: "black-9016ec48f52f2a29",
    text: "It has been N days since the last _____",
    pick: 1
  },
  {
    id: "black-aa2fb6dcf608ca39",
    text: "It is completely dark. You are likely to be eaten by a _____.",
    pick: 1
  },
  {
    id: "black-03640249eb76eb15",
    text: "It looks like you're trying to _____. Can I help?",
    pick: 1
  },
  {
    id: "black-00a621952ae74676",
    text: "It took over 40 hours to document _____.",
    pick: 1
  },
  {
    id: "black-49998bcf41111f6d",
    text: 'It turns out that the button labeled "Don\'t Push" actually does _____.',
    pick: 1
  },
  {
    id: "black-b2f7aa1fcfa0f594",
    text: "It worked on my _____.",
    pick: 1
  },
  {
    id: "black-a560b45e468e6cb9",
    text: "It's always a _____ DNS problem",
    pick: 1
  },
  {
    id: "black-8977b8f1c2d17125",
    text: "It's easy! Just run _____",
    pick: 1
  },
  {
    id: "black-4b5b4866cc1132bf",
    text: "It's like trying to herd _____.",
    pick: 1
  },
  {
    id: "black-b834491211860cf2",
    text: "It's not web scale, it's _____",
    pick: 1
  },
  {
    id: "black-360eb76b53911257",
    text: "I’m on call this week, so I fully expect _____.",
    pick: 1
  },
  {
    id: "black-82b9c3d2cd34a202",
    text: "Just change the _____, it'll be fine.",
    pick: 1
  },
  {
    id: "black-761f319561c83a0f",
    text: "Just think of the Internet as _____.",
    pick: 1
  },
  {
    id: "black-6168b7f4c0dd1e9e",
    text: "Kibana looked normal right up until _____.",
    pick: 1
  },
  {
    id: "black-38411318a2314917",
    text: "Lambdas are just a lame implementation of _____.",
    pick: 1
  },
  {
    id: "black-d7871d81d13e21ed",
    text: "Larry Wall trained as a missionary, then _____.",
    pick: 1
  },
  {
    id: "black-a391ac5e1ec74e44",
    text: "Last deployment failed because of _____.",
    pick: 1
  },
  {
    id: "black-ea5b9fef85ce7f1c",
    text: "Last time I went outside, I experienced _____.",
    pick: 1
  },
  {
    id: "black-4bbe7150436fb4a4",
    text: "Last year North Korea spent 10 million on _____.",
    pick: 1
  },
  {
    id: "black-730424106f263691",
    text: "Learn _____ the hard way",
    pick: 1
  },
  {
    id: "black-123474e4367a5e2d",
    text: "Listening to the fans in the server farm leads to _____",
    pick: 1
  },
  {
    id: "black-005ac1e33ef62b5e",
    text: "Make it _____.",
    pick: 1
  },
  {
    id: "black-a61d4ab62dd1ea96",
    text: "Managed OpenSearch stopped feeling managed as soon as we needed _____.",
    pick: 1
  },
  {
    id: "black-79446b1caddc0ce2",
    text: "Management calls it velocity. QA calls it _____.",
    pick: 1
  },
  {
    id: "black-83951c8c66508a31",
    text: "Management has changed all our job titles to _____.",
    pick: 1
  },
  {
    id: "black-a95fb20e8e0edd86",
    text: "Management just told me I need to get certified in _____.",
    pick: 1
  },
  {
    id: "black-8ec87a0679b791a5",
    text: "Management said it's OK to deploy _____ at 5pm on Friday",
    pick: 1
  },
  {
    id: "black-c48f1da20297b925",
    text: "My Cloud Drive won't sync because of _____.",
    pick: 1
  },
  {
    id: "black-25c911bc1400d4b2",
    text: "My LinkedIn Endorsements include _____.",
    pick: 1
  },
  {
    id: "black-39e608e7b7253975",
    text: "My alternative to the gym is _____.",
    pick: 1
  },
  {
    id: "black-fca34dec289eccdd",
    text: "My co-worker files a complaint because of _____.",
    pick: 1
  },
  {
    id: "black-f04c128da622c4dd",
    text: "My contribution to the codebase this quarter was mostly _____.",
    pick: 1
  },
  {
    id: "black-357a5a2f37e418e2",
    text: "My editor of choice is _____.",
    pick: 1
  },
  {
    id: "black-1e556321b57082dc",
    text: "My editor suggested _____ and, against my better judgment, I accepted it.",
    pick: 1
  },
  {
    id: "black-ed9c17069c1a69a2",
    text: "My eyes started bleeding when I opened the editor and saw _____.",
    pick: 1
  },
  {
    id: "black-c97f29429ad48046",
    text: "My job feels like _____.",
    pick: 1
  },
  {
    id: "black-ac56a74e0fa4e094",
    text: 'My next Velocity talk is called "_____ops"',
    pick: 1
  },
  {
    id: "black-3043710bfa0013f5",
    text: "My security is so good, it _____.",
    pick: 1
  },
  {
    id: "black-244dd047495289fd",
    text: "Network dropped connection because of _____.",
    pick: 1
  },
  {
    id: "black-c93d459454dfc8d4",
    text: "Never question the _____",
    pick: 1
  },
  {
    id: "black-fcc2043b2676facf",
    text: "Next year I'll start learning _____",
    pick: 1
  },
  {
    id: "black-6bf156e16511454a",
    text: "No route to host: _____.",
    pick: 1
  },
  {
    id: "black-d1f84000b9256472",
    text: "No, _____ being hopelessly broken is NOT an emergency.",
    pick: 1
  },
  {
    id: "black-df42d75ebb2855ec",
    text: "NoSQL is superior to SQL because _____",
    pick: 1
  },
  {
    id: "black-d40ecb81a0c46e65",
    text: "Nobody ever got fired for buying _____.",
    pick: 1
  },
  {
    id: "black-00e4cb42d629664a",
    text: "Nobody wanted to say it out loud, but the release clearly needed _____.",
    pick: 1
  },
  {
    id: "black-436e7ffa60714ccc",
    text: 'Nothing says "senior engineer" like _____.',
    pick: 1
  },
  {
    id: "black-143b61c65fde11e5",
    text: "Nothing says reliability like _____.",
    pick: 1
  },
  {
    id: "black-92ee89538360ec41",
    text: "Of course culture is important to us, that's why we have _____.",
    pick: 1
  },
  {
    id: "black-3ba05f02e5b49d5a",
    text: "Oh, we're devops! We have _____ in the office, but only the DBA can touch it.",
    pick: 1
  },
  {
    id: "black-fb53b868865d5e8c",
    text: "On a scale from 1 to 10, this is _____!",
    pick: 1
  },
  {
    id: "black-7f4e805c01c8a5dd",
    text: "On my GitHub profile you will find _____.",
    pick: 1
  },
  {
    id: "black-5e5a76a66ca6346e",
    text: "On our Offsite we did _____.",
    pick: 1
  },
  {
    id: "black-6f6a57d567bc11c1",
    text: "On the plus side, we finally got rid of _____.",
    pick: 1
  },
  {
    id: "black-8345729f5aae36e3",
    text: "One does not simply _____",
    pick: 1
  },
  {
    id: "black-1d07420fd52c067d",
    text: "Only the Enterprise Edition(tm) has _____.",
    pick: 1
  },
  {
    id: "black-560f98da40ae024c",
    text: "OpenSearch performance improved briefly, until _____ arrived.",
    pick: 1
  },
  {
    id: "black-7fcfd02ca908563b",
    text: "Our A/B test conclusively proved _____.",
    pick: 1
  },
  {
    id: "black-3dac08d5d7a83e77",
    text: "Our OpenSearch cluster lost the will to live after _____.",
    pick: 1
  },
  {
    id: "black-38548ab01ee941b4",
    text: "Our Series A deck now includes a slide about _____ AI.",
    pick: 1
  },
  {
    id: "black-14c7edb406a92575",
    text: "Our USP is _____.",
    pick: 1
  },
  {
    id: "black-a7c0b9c510440c03",
    text: "Our architecture diagram was basically a map of _____.",
    pick: 1
  },
  {
    id: "black-18e6aa017bd34f04",
    text: "Our backup policy is _____",
    pick: 1
  },
  {
    id: "black-54d857a721f3df1d",
    text: "Our best documentation is still _____ in Slack.",
    pick: 1
  },
  {
    id: "black-1a338b6dcd3863ab",
    text: "Our bold new AI feature mostly does _____.",
    pick: 1
  },
  {
    id: "black-c47f71735c19f09c",
    text: "Our bold new reliability initiative is centered on _____.",
    pick: 1
  },
  {
    id: "black-7d3063986a32d8b7",
    text: "Our capacity plan did not account for _____.",
    pick: 1
  },
  {
    id: "black-2a91629a87399510",
    text: "Our cluster state grew to an unreasonable size because of _____.",
    pick: 1
  },
  {
    id: "black-4e2b2e5e94329bf1",
    text: "Our competitive advantage is our _____.",
    pick: 1
  },
  {
    id: "black-93b45104c6d38093",
    text: "Our definition of done now includes _____.",
    pick: 1
  },
  {
    id: "black-6f33fb413bb7f088",
    text: "Our engineering values can be summarized as _____.",
    pick: 1
  },
  {
    id: "black-64cb403202164dea",
    text: "Our entire app is geared towards providing _____.",
    pick: 1
  },
  {
    id: "black-32082b5795428f6f",
    text: "Our greatest achievement in the last year is _____.",
    pick: 1
  },
  {
    id: "black-f25e3a002ccd6c80",
    text: "Our incident commander brought calm, clarity, and _____.",
    pick: 1
  },
  {
    id: "black-be9b44f98411e6ba",
    text: "Our launch checklist somehow forgot _____.",
    pick: 1
  },
  {
    id: "black-d5770cdb42cdb139",
    text: "Our newest SRE initiative is mostly _____ with extra dashboards.",
    pick: 1
  },
  {
    id: "black-675b7834eb3909e5",
    text: "Our only hope at recovering the data is _____",
    pick: 1
  },
  {
    id: "black-d3709869803ee2c0",
    text: 'Our ops strategy can be summarized as "wait for _____."',
    pick: 1
  },
  {
    id: "black-be9b79b8d294b935",
    text: "Our production backups are stored using _____.",
    pick: 1
  },
  {
    id: "black-026379b7c9a57e3c",
    text: "Our prompt engineering strategy can be summarized as _____.",
    pick: 1
  },
  {
    id: "black-85820a046ec082ed",
    text: "Our runbook has no guidance for handling _____.",
    pick: 1
  },
  {
    id: "black-a43e6fe68a1c5a9b",
    text: "Our seed round paid for eighteen months of runway and _____.",
    pick: 1
  },
  {
    id: "black-23e25983d0df0043",
    text: "Our startup culture peaked right before _____.",
    pick: 1
  },
  {
    id: "black-8323d3ea84357110",
    text: "Our status page carefully described the outage as _____.",
    pick: 1
  },
  {
    id: "black-94992c1babc3c10c",
    text: "Our status page says everything is operational, except _____.",
    pick: 1
  },
  {
    id: "black-6417883c387908d8",
    text: "Our system got a lot calmer once Temporal took over _____.",
    pick: 1
  },
  {
    id: "black-c28be5747c786cb7",
    text: "Our systems for _____ runs only on raspberry pies.",
    pick: 1
  },
  {
    id: "black-acb4ec80eb337a53",
    text: "Please bring back _____. You broke my workflow.",
    pick: 1
  },
  {
    id: "black-d245ab0863520faa",
    text: "Problem exists between Keyboard and _____",
    pick: 1
  },
  {
    id: "black-3f9ca2c86b7e74f9",
    text: "Product said users really want _____.",
    pick: 1
  },
  {
    id: "black-8dcb06c7edbeca70",
    text: "Prompting the model for backend help somehow produced _____.",
    pick: 1
  },
  {
    id: "black-d7f9ccbda1efe43b",
    text: "Put some _____ on it",
    pick: 1
  },
  {
    id: "black-c68c9221d37b3343",
    text: "Read-eval-_____-loop.",
    pick: 1
  },
  {
    id: "black-e45cfaf1a9c301d9",
    text: "Recruiting says candidates are excited about our use of _____.",
    pick: 1
  },
  {
    id: "black-18e2cc2dd58b610f",
    text: "RedHat has announced that RHEL 8 will ship with _____.",
    pick: 1
  },
  {
    id: "black-4fa3b8fb7842801f",
    text: "Restoring from backups failed due to _____.",
    pick: 1
  },
  {
    id: "black-d62af6e047eea58a",
    text: "Robots are going to make _____ obsolete.",
    pick: 1
  },
  {
    id: "black-090572715cbd7cf3",
    text: "Root cause of the outage? _____.",
    pick: 1
  },
  {
    id: "black-313a1ec811b7d258",
    text: "Rub a little _____ on it",
    pick: 1
  },
  {
    id: "black-b7c6e91157319c0c",
    text: "Running Windows in production leads to _____.",
    pick: 1
  },
  {
    id: "black-0db055e6da42c81f",
    text: "SIG_____",
    pick: 1
  },
  {
    id: "black-650585e3308df29d",
    text: "Scaling to millions of users will be easy once we fix _____.",
    pick: 1
  },
  {
    id: "black-f2f5429175cc60b8",
    text: "Security through _____.",
    pick: 1
  },
  {
    id: "black-80301df42351d7d6",
    text: "Security? We've got that! We use _____.",
    pick: 1
  },
  {
    id: "black-158d4b3e05cab410",
    text: "So, I was using Wireshark to check network traffic... Did you know we have _____ in production?",
    pick: 1
  },
  {
    id: "black-5f778b913998df2a",
    text: "Software Defined _____.",
    pick: 1
  },
  {
    id: "black-64232c74d450a4c1",
    text: "Software development is like _____.",
    pick: 1
  },
  {
    id: "black-2638c1752fa6d0ca",
    text: "Someone opened Dev Tools and immediately chose _____.",
    pick: 1
  },
  {
    id: "black-e69e5d6ff825fca1",
    text: "Somewhere in this monorepo there is _____ and nobody owns it.",
    pick: 1
  },
  {
    id: "black-89cead1225df9f94",
    text: "Sorry, I'm all out of _____-fu.",
    pick: 1
  },
  {
    id: "black-dd6a2a18ab249119",
    text: "Sorry, you'll need to open a ticket before we can _____.",
    pick: 1
  },
  {
    id: "black-ba59d8ec665d6b45",
    text: "Support escalated this ticket because the customer keeps mentioning _____.",
    pick: 1
  },
  {
    id: "black-916f62ae08ebb4e2",
    text: "Support says the bug is easy to reproduce if you just _____.",
    pick: 1
  },
  {
    id: "black-fe98e8e3c1c4b56e",
    text: "Sweet! I just found a Puppet module for _____!",
    pick: 1
  },
  {
    id: "black-29c3b1e8a4aa67f4",
    text: "Temporal is the only reason _____ happens exactly once.",
    pick: 1
  },
  {
    id: "black-7f820cda683207f0",
    text: "Temporal is why _____ keeps working while everything else is on fire.",
    pick: 1
  },
  {
    id: "black-cbacf767a4c04037",
    text: "Temporal made _____ boring in the best possible way.",
    pick: 1
  },
  {
    id: "black-6314f9503e17d2c2",
    text: "Temporal made _____ recover like nothing happened.",
    pick: 1
  },
  {
    id: "black-17505c44c0dd7e0f",
    text: "Temporal made _____ reliable enough for management to notice.",
    pick: 1
  },
  {
    id: "black-69d3308e195d5a57",
    text: "Temporal made _____ survive deploys, crashes, and bad decisions.",
    pick: 1
  },
  {
    id: "black-e871d0c71450cace",
    text: "Temporal saved us from writing our own _____ orchestration.",
    pick: 1
  },
  {
    id: "black-c3fd29b5d2a59f6f",
    text: "The 11-star user experience is _____.",
    pick: 1
  },
  {
    id: "black-9bf82cd95d1bcb0b",
    text: "The AI assistant handled the boilerplate, the edge cases, and _____.",
    pick: 1
  },
  {
    id: "black-6fb7e8aa670d1d75",
    text: "The AI assistant was incredibly helpful right up until _____.",
    pick: 1
  },
  {
    id: "black-1e15371e2b2947fe",
    text: "The AI saved me 30 minutes by introducing _____.",
    pick: 1
  },
  {
    id: "black-94a44bb415f13023",
    text: "The CI pipeline yearns for _____.",
    pick: 1
  },
  {
    id: "black-9495bcbdcabf19f6",
    text: "The Elasticsearch outage summary can be reduced to _____.",
    pick: 1
  },
  {
    id: "black-62cf447cc2f0c0ec",
    text: "The Elasticsearch upgrade plan collapsed the moment someone suggested _____.",
    pick: 1
  },
  {
    id: "black-f76541b5fdce6208",
    text: "The Internet is for cat memes and _____.",
    pick: 1
  },
  {
    id: "black-5adc81cb4db352e5",
    text: "The Internet of Things will be controlled by _____.",
    pick: 1
  },
  {
    id: "black-91a3bd01dab731dd",
    text: "The OpenSearch roadmap meeting was derailed by _____.",
    pick: 1
  },
  {
    id: "black-8c0f9d163d2f04f5",
    text: "The PR got weird right after someone pasted _____ into the prompt.",
    pick: 1
  },
  {
    id: "black-80989a0ffc55f1a6",
    text: "The VP called it innovation. The rest of us called it _____.",
    pick: 1
  },
  {
    id: "black-ecdf041a9234a195",
    text: "The _____ Public License.",
    pick: 1
  },
  {
    id: "black-6bbb31c973bff277",
    text: "The _____ certification program.",
    pick: 1
  },
  {
    id: "black-8b62a43aa66da3f6",
    text: "The _____ is used when the CPU is on fire",
    pick: 1
  },
  {
    id: "black-a5a0146b617e9657",
    text: "The autocomplete knew exactly how to implement _____, which was concerning.",
    pick: 1
  },
  {
    id: "black-8f700c1568d744d5",
    text: "The backups are fine, but the restore process is _____",
    pick: 1
  },
  {
    id: "black-c12086243c597c97",
    text: "The best way to make Elasticsearch sad is _____.",
    pick: 1
  },
  {
    id: "black-6e2862b170667ca6",
    text: "The booth is themed _____.",
    pick: 1
  },
  {
    id: "black-1c8119aa509f7c3c",
    text: "The bug report was instantly translated into _____ by the AI tooling.",
    pick: 1
  },
  {
    id: "black-4a591ee354e06796",
    text: "The build cache was poisoned by _____.",
    pick: 1
  },
  {
    id: "black-2830bea37850c19f",
    text: "The chatbot has strong opinions about _____.",
    pick: 1
  },
  {
    id: "black-d9b88c2212f9c963",
    text: "The client says it needs more _____.",
    pick: 1
  },
  {
    id: "black-a526834d04a5320d",
    text: "The cluster would probably be stable if not for _____.",
    pick: 1
  },
  {
    id: "black-2b2815f9a61782fb",
    text: "The code review was complicated by suspicion of _____.",
    pick: 1
  },
  {
    id: "black-c8e242e6d2dacc01",
    text: "The customer called it unusable. We called it _____.",
    pick: 1
  },
  {
    id: "black-6f9a800fc84774c2",
    text: "The customer requests _____.",
    pick: 1
  },
  {
    id: "black-1e2d2fcdb07a1de3",
    text: "The dashboard said everything was healthy, except for _____",
    pick: 1
  },
  {
    id: "black-2f40f9c5fbb7dfca",
    text: "The demo went great until the model generated _____.",
    pick: 1
  },
  {
    id: "black-a25da04f7b7acfd5",
    text: "The difference between RSA and DSA is _____.",
    pick: 1
  },
  {
    id: "black-264c13a12309aab4",
    text: "The fastest way to burn GPU budget is _____.",
    pick: 1
  },
  {
    id: "black-adf9c378d6fc20b4",
    text: "The fastest way to turn a green dashboard red is _____.",
    pick: 1
  },
  {
    id: "black-98f29d9dc5bad03e",
    text: "The first clue that production was doomed was _____.",
    pick: 1
  },
  {
    id: "black-3fad0b6432bd49bd",
    text: "The flaky test was eventually traced back to _____.",
    pick: 1
  },
  {
    id: "black-d4a1c238cb05a47b",
    text: "The founder called it a culture issue. It was actually _____.",
    pick: 1
  },
  {
    id: "black-3274ae2ce5ebda4f",
    text: "The generated SQL was beautiful, unreadable, and full of _____.",
    pick: 1
  },
  {
    id: "black-313d10149a4da87d",
    text: "The generated commit message somehow blamed _____.",
    pick: 1
  },
  {
    id: "black-38d03f3524b76c87",
    text: "The generated unit tests were very thorough about _____.",
    pick: 1
  },
  {
    id: "black-8c9661c491796c45",
    text: "The intern just ran _____ on the load balancer.",
    pick: 1
  },
  {
    id: "black-dbbc3543386855f3",
    text: "The migration to Elasticsearch 8 was delayed by _____.",
    pick: 1
  },
  {
    id: "black-98cda8b18012ec76",
    text: "The most dangerous button in my IDE now triggers _____.",
    pick: 1
  },
  {
    id: "black-d6906f1a9cea9139",
    text: "The most expensive line item in the cloud bill was _____.",
    pick: 1
  },
  {
    id: "black-3159cbe540a7e957",
    text: "The most stable part of our infrastructure? _____",
    pick: 1
  },
  {
    id: "black-0c06cf4ec99acc83",
    text: "The new marketing campaign for April 1st will be _____.",
    pick: 1
  },
  {
    id: "black-bf1d243749dcf800",
    text: "The next blog article will be about _____.",
    pick: 1
  },
  {
    id: "black-898d42b6b3e22c97",
    text: "The next superior cloud service will use _____.",
    pick: 1
  },
  {
    id: "black-07a126fcfc5acbde",
    text: "The nicest thing anyone said in the postmortem was _____.",
    pick: 1
  },
  {
    id: "black-6b63006e5a9319bf",
    text: "The on-call rotation became a lot worse after _____.",
    pick: 1
  },
  {
    id: "black-6d70de6ae9e38645",
    text: "The only environment less stable than production is _____.",
    pick: 1
  },
  {
    id: "black-ca20293dca862a6d",
    text: "The only thing necessary for evil to triumph is _____.",
    pick: 1
  },
  {
    id: "black-847557ebbb5a6ff1",
    text: "The only thing scarier than a sev-one is _____.",
    pick: 1
  },
  {
    id: "black-fa0d894e02d6806d",
    text: "The only thing standing between us and AGI is _____.",
    pick: 1
  },
  {
    id: "black-a12f2bb72b25d263",
    text: "The only thing worse than being on call is _____.",
    pick: 1
  },
  {
    id: "black-47dc016fe73fb482",
    text: "The pager woke me up at 2:13 AM because of _____.",
    pick: 1
  },
  {
    id: "black-aefdd79cf51ec949",
    text: "The performance regression was caused by a well-intentioned attempt at _____.",
    pick: 1
  },
  {
    id: "black-ed92a6b7e96fe2c5",
    text: "The platform team drew the line at supporting _____.",
    pick: 1
  },
  {
    id: "black-80f99428a12d632c",
    text: "The plugin situation became truly unmanageable once we added _____.",
    pick: 1
  },
  {
    id: "black-8d46f81a032bb6e8",
    text: "The postmortem action items somehow turned into _____.",
    pick: 1
  },
  {
    id: "black-a03f6a35a09377aa",
    text: "The principal engineer called it elegant. It was actually _____.",
    pick: 1
  },
  {
    id: "black-68511482543fc1c1",
    text: "The production datacenter burned down because of _____.",
    pick: 1
  },
  {
    id: "black-56f72c5b559925d0",
    text: "The real single point of failure was always _____.",
    pick: 1
  },
  {
    id: "black-7e6313f9cd2cf63e",
    text: "The release notes were mostly about bug fixes, regressions, and _____.",
    pick: 1
  },
  {
    id: "black-7d40940b33bb7d48",
    text: "The release was blocked by _____.",
    pick: 1
  },
  {
    id: "black-c61d01b10c6fe687",
    text: "The roadmap was rewritten to prioritize _____.",
    pick: 1
  },
  {
    id: "black-4845b3dfc091ce27",
    text: "The root cause analysis ended with a surprising amount of _____.",
    pick: 1
  },
  {
    id: "black-528aebca8855e659",
    text: 'The scariest phrase in ops is "I already ran _____."',
    pick: 1
  },
  {
    id: "black-3941c99eb7000c16",
    text: "The screenshot in the support ticket was mostly _____.",
    pick: 1
  },
  {
    id: "black-7afb5823e8ed3ed6",
    text: "The search cluster became emotionally unavailable after _____.",
    pick: 1
  },
  {
    id: "black-26fdf29b92b305b2",
    text: "The search latency spike was eventually traced back to _____.",
    pick: 1
  },
  {
    id: "black-9014f2ad2bdb20c2",
    text: "The search team tried to fix relevance with _____.",
    pick: 1
  },
  {
    id: "black-b218aa6ac6f914f4",
    text: 'The second scariest phrase in ops is "I can fix this with _____."',
    pick: 1
  },
  {
    id: "black-cbf89026e4e73736",
    text: "The startup all-hands took a dark turn when someone mentioned _____.",
    pick: 1
  },
  {
    id: "black-9ca1fd68de72fc99",
    text: "The startup survived another quarter thanks to _____.",
    pick: 1
  },
  {
    id: "black-6da35d5147694f8f",
    text: "The status console is green, but I can't access _____.",
    pick: 1
  },
  {
    id: "black-fce00f1f38ad93c5",
    text: "The team achieved five nines of availability by ignoring _____.",
    pick: 1
  },
  {
    id: "black-a4a77ab50592644d",
    text: "The team chat got very quiet when someone mentioned _____.",
    pick: 1
  },
  {
    id: "black-4b6fd5062824e057",
    text: "The tech support hotline told me to _____",
    pick: 1
  },
  {
    id: "black-3cd3d51bbaad7448",
    text: "The test suite passed right up until _____.",
    pick: 1
  },
  {
    id: "black-97b3cc07f49f873a",
    text: "The ticket to install _____?  I deletegated it.",
    pick: 1
  },
  {
    id: "black-3fa034fd5899c433",
    text: "The trouble with kids these days is _____",
    pick: 1
  },
  {
    id: "black-71c235ffd4d50013",
    text: "The unexpected consequence of microservices was _____.",
    pick: 1
  },
  {
    id: "black-5f7aea065f450057",
    text: 'The user report said "it stopped working after _____."',
    pick: 1
  },
  {
    id: "black-317f6aa576254114",
    text: "There still is a bug in _____.",
    pick: 1
  },
  {
    id: "black-c99237da406b0dd7",
    text: "This PR could have been smaller if not for _____.",
    pick: 1
  },
  {
    id: "black-1267780f615333af",
    text: "This codebase runs on caffeine, fear, and _____.",
    pick: 1
  },
  {
    id: "black-04853be68fcb0426",
    text: "This feature exists because one enterprise customer wanted _____.",
    pick: 1
  },
  {
    id: "black-fb6ccdd6e7e76487",
    text: "This isn't going to be all unicorns and _____.",
    pick: 1
  },
  {
    id: "black-f48697a1c8bb3eb8",
    text: "This outage has been escalated to whoever understands _____.",
    pick: 1
  },
  {
    id: "black-26242f9e869b3940",
    text: "This quarter’s reliability work has been deprioritized in favor of _____.",
    pick: 1
  },
  {
    id: "black-6468120888be7ced",
    text: "This refactor was supposed to improve maintainability, but mostly it introduced _____.",
    pick: 1
  },
  {
    id: "black-6a7a3a21f4629bd6",
    text: "This release candidate contains bug fixes, regressions, and _____.",
    pick: 1
  },
  {
    id: "black-26213136073c79a5",
    text: "This used to be a normal SaaS product before we added _____.",
    pick: 1
  },
  {
    id: "black-0f13f098b89330e3",
    text: "This week, Aphyr runs _____ through jepsen.",
    pick: 1
  },
  {
    id: "black-6683218b9aaaa14f",
    text: "This year's marketing motto is _____.",
    pick: 1
  },
  {
    id: "black-bf05d4948c355ede",
    text: "Those who don't understand _____ are condemned to reinvent it, poorly",
    pick: 1
  },
  {
    id: "black-a187fe98153c8de5",
    text: "Time to schedule the postmortem for _____.",
    pick: 1
  },
  {
    id: "black-7b5175330067cbc0",
    text: "To fix the flaky test, we replaced it with _____.",
    pick: 1
  },
  {
    id: "black-9667a213743b5609",
    text: "To improve developer productivity, management deployed _____.",
    pick: 1
  },
  {
    id: "black-1a81ed29461c012a",
    text: "To reduce alert fatigue, we replaced every alert with _____.",
    pick: 1
  },
  {
    id: "black-5b02aaffb9595afa",
    text: "To secure our next round of funding, Management says we need _____.",
    pick: 1
  },
  {
    id: "black-a10cd23722482829",
    text: "Today's standup was mostly updates about _____.",
    pick: 1
  },
  {
    id: "black-d336a8ba4b03e2be",
    text: "Turns out our zero-downtime deploy strategy depended on _____.",
    pick: 1
  },
  {
    id: "black-8017dd13d5055620",
    text: "Turns out the LLM was trained extensively on _____.",
    pick: 1
  },
  {
    id: "black-a8192460e49da58d",
    text: "Turns out the model's favorite design pattern is _____.",
    pick: 1
  },
  {
    id: "black-4bd7e639e34cfb93",
    text: "Uber is on surge pricing because of _____.",
    pick: 1
  },
  {
    id: "black-03174248e8999ffb",
    text: "Users are _____.",
    pick: 1
  },
  {
    id: "black-317e106c286a8498",
    text: "WAIT, YOU DELETED _____‽‽‽",
    pick: 1
  },
  {
    id: "black-c71fc64c479d69f8",
    text: "WARN: _____ has been deprecated.",
    pick: 1
  },
  {
    id: "black-03e8237098a96d36",
    text: "We accidentally built an entire platform around _____.",
    pick: 1
  },
  {
    id: "black-537180fcbec92d26",
    text: "We accidently the whole _____..",
    pick: 1
  },
  {
    id: "black-8a41c9f86bc10da3",
    text: "We added a feature flag for _____. Now nobody remembers how the system actually works.",
    pick: 1
  },
  {
    id: "black-6b13c1e1517fb3b8",
    text: "We can _____ just like Netflix",
    pick: 1
  },
  {
    id: "black-57958e53ffedd822",
    text: "We can absolutely ship this before Monday if we ignore _____.",
    pick: 1
  },
  {
    id: "black-ef93b2fcd6064ce4",
    text: "We can discuss _____ at the stand-up meeting.",
    pick: 1
  },
  {
    id: "black-3e32dd9b04e9a85f",
    text: "We can just fix that with a little _____.",
    pick: 1
  },
  {
    id: "black-3fee26a36b3fe203",
    text: "We can't pay you, but we can offer _____ in compensation.",
    pick: 1
  },
  {
    id: "black-b50232a77b30a91b",
    text: "We discovered too late that the vendor API was powered by _____.",
    pick: 1
  },
  {
    id: "black-bad1c79339f15511",
    text: "We don't have a knowledge-sharing problem, we have too much _____.",
    pick: 1
  },
  {
    id: "black-9a7081bb2457333b",
    text: "We don't have enough package managers, said _____.",
    pick: 1
  },
  {
    id: "black-acf5113959dc110b",
    text: "We don't have to worry about CAP Theorem because of _____.",
    pick: 1
  },
  {
    id: "black-f89ef3e151b60c97",
    text: "We don't need backups, we've got _____.",
    pick: 1
  },
  {
    id: "black-141f22016956583a",
    text: "We don't need configuration management, we have _____!",
    pick: 1
  },
  {
    id: "black-ffc8178111ee93b7",
    text: "We don't need to worry about _____, we're using MongoDB.",
    pick: 1
  },
  {
    id: "black-17e2707ad1637725",
    text: "We finally automated _____ with a chatbot and regret.",
    pick: 1
  },
  {
    id: "black-4e1a73fe040e0767",
    text: "We finally hired a platform engineer to manage _____.",
    pick: 1
  },
  {
    id: "black-b6427edfb23a051e",
    text: "We finally stopped losing track of _____ thanks to Temporal.",
    pick: 1
  },
  {
    id: "black-83e16b4d7fbb4caf",
    text: "We finally tracked the race condition down to _____.",
    pick: 1
  },
  {
    id: "black-f5474c4c4675f9cc",
    text: "We fixed the build by deleting _____.",
    pick: 1
  },
  {
    id: "black-eacbbbed2bebf149",
    text: "We gave the intern ownership of _____ and learned a lot about trust.",
    pick: 1
  },
  {
    id: "black-afe56334e783c36a",
    text: "We increased test coverage by _____.",
    pick: 1
  },
  {
    id: "black-ec7d697ed13abae6",
    text: "We just achieved _____s per second!",
    pick: 1
  },
  {
    id: "black-c3c8ebb5266215e0",
    text: "We knew the shard strategy was flawed when it started resembling _____.",
    pick: 1
  },
  {
    id: "black-c55b465e4b6770ff",
    text: "We merged the hotfix and accidentally shipped _____.",
    pick: 1
  },
  {
    id: "black-e3bc618f909442ac",
    text: "We only noticed the memory leak after _____.",
    pick: 1
  },
  {
    id: "black-12c323a330ae0c18",
    text: "We really need to open-source our _____.",
    pick: 1
  },
  {
    id: "black-7345c265fa26ebf2",
    text: "We replaced the monolith with microservices and gained _____.",
    pick: 1
  },
  {
    id: "black-af819768331e3f2d",
    text: "We replaced the search bar with _____.",
    pick: 1
  },
  {
    id: "black-000574ef800116f8",
    text: "We rewrote the legacy module and preserved all the original _____.",
    pick: 1
  },
  {
    id: "black-2ff8d2ef8a053c6d",
    text: "We run _____ in a cron job every 15 minutes.",
    pick: 1
  },
  {
    id: "black-fe1b813266c68e49",
    text: "We scaled the system horizontally and multiplied _____.",
    pick: 1
  },
  {
    id: "black-c0661d69acab6603",
    text: "We shortened the postmortem by blaming _____.",
    pick: 1
  },
  {
    id: "black-415f3ebd43ba6fc6",
    text: "We should try it with an actual _____.",
    pick: 1
  },
  {
    id: "black-95c2a860758f6093",
    text: "We took the plunge and rewrote _____ in Go",
    pick: 1
  },
  {
    id: "black-d20dd6b8789f3292",
    text: "We trust Temporal with _____ because we no longer trust ourselves.",
    pick: 1
  },
  {
    id: "black-0bf8cc0631322c84",
    text: "We turned off _____ and everything magically got better.",
    pick: 1
  },
  {
    id: "black-fc99e263ead600a0",
    text: "We use _____ for quality control.",
    pick: 1
  },
  {
    id: "black-8f68c0312f523d9b",
    text: "We were promised developer velocity. We got _____.",
    pick: 1
  },
  {
    id: "black-e3cab968f5c00d5f",
    text: "We wrote our own build tool based on _____",
    pick: 1
  },
  {
    id: "black-09f57b96434447f1",
    text: "We're a _____ as a Service company.",
    pick: 1
  },
  {
    id: "black-37c5313348547417",
    text: "We're not burning cash, we're investing heavily in _____.",
    pick: 1
  },
  {
    id: "black-a100c257adc18a85",
    text: "We're running _____ in production?!",
    pick: 1
  },
  {
    id: "black-aaf3a1f4c6c4a3c7",
    text: "We're spending 20% of this sprint doing _____.",
    pick: 1
  },
  {
    id: "black-f9f1ef1f5668df48",
    text: "We’re calling it innovation, but it’s mostly _____.",
    pick: 1
  },
  {
    id: "black-470b26c395f41cf5",
    text: "What do you mean the chatbot is exposing _____?",
    pick: 1
  },
  {
    id: "black-479906647a62391f",
    text: "What finally convinced leadership to fund reliability work was _____.",
    pick: 1
  },
  {
    id: "black-3ff54648cea1717a",
    text: "What really killed team morale was _____.",
    pick: 1
  },
  {
    id: "black-1e22beed7eddaf67",
    text: 'What the customer described as "slowness" was actually _____.',
    pick: 1
  },
  {
    id: "black-d00d59d6a2785b11",
    text: "When I hooked the 3D printer up to the Internet, it accidentally created _____.",
    pick: 1
  },
  {
    id: "black-437a65dd6c95ad46",
    text: "When I was a kid we didn't have _____.",
    pick: 1
  },
  {
    id: "black-72ba6013ab151362",
    text: 'When I write a book about my experiences, it\'ll be called "_____, the good parts"',
    pick: 1
  },
  {
    id: "black-4c658114edda4786",
    text: 'When the founder says "default alive," they mean _____.',
    pick: 1
  },
  {
    id: "black-85654fe179c41207",
    text: 'When the marketing intern asks: "Can you please change _____ on the website"',
    pick: 1
  },
  {
    id: "black-e1ff3430ccbf9a89",
    text: "When the pager goes off, I immediately assume _____.",
    pick: 1
  },
  {
    id: "black-327256ddbb7c9276",
    text: "When the sales guys are laughing in their office they are _____.",
    pick: 1
  },
  {
    id: "black-1a8fd7287733248e",
    text: "Who thought that _____ was a good idea?",
    pick: 1
  },
  {
    id: "black-ae0140475999e93b",
    text: "Who would have known that _____ could destroy an entire datacenter?",
    pick: 1
  },
  {
    id: "black-df295193f85cdf4a",
    text: "Whoever made the unscheduled change to production on Friday will be forced to use _____.",
    pick: 1
  },
  {
    id: "black-105697969657396d",
    text: "Why does every sprint board look like a crime scene because of _____?",
    pick: 1
  },
  {
    id: "black-acc411157b2384f9",
    text: "Why does every sprint end with _____ in the main branch?",
    pick: 1
  },
  {
    id: "black-220fee778a593b6f",
    text: "Why does every support ticket somehow involve _____?",
    pick: 1
  },
  {
    id: "black-addbbbdd64bd1c5a",
    text: "Why does someone keep re-implementing system utilities in _____?",
    pick: 1
  },
  {
    id: "black-788cc1bfd9ca93d0",
    text: "Why don't we just fork _____ ?",
    pick: 1
  },
  {
    id: "black-40bd20f70a4b8003",
    text: "Why is _____ better than Hadoop?",
    pick: 1
  },
  {
    id: "black-54d036eac35acf30",
    text: "Why is root running _____ under tmux?",
    pick: 1
  },
  {
    id: "black-c9328e54d798f9a3",
    text: "Why is the pipeline red? _____.",
    pick: 1
  },
  {
    id: "black-cc6d8d6dc7e488e1",
    text: "Why was _____ ever a shared library?",
    pick: 1
  },
  {
    id: "black-5ea38d486156632b",
    text: "Will merge pull requests for _____.",
    pick: 1
  },
  {
    id: "black-ac9d08117689aa26",
    text: "With _____, you write once, run nowhere.",
    pick: 1
  },
  {
    id: "black-40faa593ab146ec6",
    text: "Works on my _____.",
    pick: 1
  },
  {
    id: "black-19704eb44be057f6",
    text: "Would you like _____ with that?",
    pick: 1
  },
  {
    id: "black-5a4a15cd1af419f4",
    text: "Wrap it with the _____ duct tape",
    pick: 1
  },
  {
    id: "black-070966a57bde8044",
    text: "Yeah, but can it run _____?",
    pick: 1
  },
  {
    id: "black-64c81cb0d2b84c57",
    text: "You can tell a startup is maturing when it replaces perks with _____.",
    pick: 1
  },
  {
    id: "black-5d02d45eb3faac30",
    text: "You can't fix _____",
    pick: 1
  },
  {
    id: "black-f70f6e06b11d03c0",
    text: "Zero-day _____.",
    pick: 1
  },
  {
    id: "black-356807fe21590225",
    text: "_____",
    pick: 1
  },
  {
    id: "black-8814bca2f9cf2533",
    text: "_____ Considered Harmful",
    pick: 1
  },
  {
    id: "black-348e0c7f2b7f0d84",
    text: "_____ Driven Development.",
    pick: 1
  },
  {
    id: "black-c2d5945032248cad",
    text: "_____ all the things.",
    pick: 1
  },
  {
    id: "black-383fdb954ba7e18a",
    text: "_____ all the way down.",
    pick: 1
  },
  {
    id: "black-1af79c588f7f8be5",
    text: "_____ as a Service",
    pick: 1
  },
  {
    id: "black-7966caf3315f93ae",
    text: "_____ as a service.",
    pick: 1
  },
  {
    id: "black-fd6722834c7925bd",
    text: "_____ ate all my memory",
    pick: 1
  },
  {
    id: "black-6b921cfa06bbca9a",
    text: "_____ but with a chatbot in front of it.",
    pick: 1
  },
  {
    id: "black-ba1221937fe18ebc",
    text: "_____ computing",
    pick: 1
  },
  {
    id: "black-d536ec2cff301acb",
    text: "_____ dependency hell.",
    pick: 1
  },
  {
    id: "black-31fafb4f25eec7d0",
    text: "_____ discontinued support for the Linux version.",
    pick: 1
  },
  {
    id: "black-a142936ea57a50a7",
    text: "_____ dooms any project to epic failure.",
    pick: 1
  },
  {
    id: "black-eaffcf9cd20de754",
    text: "_____ for the win!",
    pick: 1
  },
  {
    id: "black-41692f9d921c49b3",
    text: "_____ has been killed with fire.  My work is done here.",
    pick: 1
  },
  {
    id: "black-f848035bcc1a3eaa",
    text: "_____ has root access.",
    pick: 1
  },
  {
    id: "black-5267ceff834877ad",
    text: "_____ is a feature, not a bug.",
    pick: 1
  },
  {
    id: "black-ca54cb7fb1ada139",
    text: "_____ is dead.",
    pick: 1
  },
  {
    id: "black-2f8ec75dbf7f6f62",
    text: "_____ is for closers.",
    pick: 1
  },
  {
    id: "black-f823cc89315fcfb9",
    text: "_____ is how I resolve all merge conflicts.",
    pick: 1
  },
  {
    id: "black-f52249b4cf11e375",
    text: "_____ is more memory than anyone will ever need on a computer.",
    pick: 1
  },
  {
    id: "black-20fcbe1e5ecc7231",
    text: "_____ is now AI-powered, unfortunately.",
    pick: 1
  },
  {
    id: "black-26ed03f094575e91",
    text: "_____ is our AI strategy now.",
    pick: 1
  },
  {
    id: "black-ef651898e0267d70",
    text: "_____ is the newest gTLD",
    pick: 1
  },
  {
    id: "black-09ca2914bb042adc",
    text: "_____ is weaponized privilege.",
    pick: 1
  },
  {
    id: "black-7927c1c6f4aaa344",
    text: "_____ is webscale.",
    pick: 1
  },
  {
    id: "black-5155a52e00a6c82d",
    text: "_____ isn't a job title",
    pick: 1
  },
  {
    id: "black-93ef7b50ee52d602",
    text: "_____ isn't new, we used to do it in the '70s on mainframes.",
    pick: 1
  },
  {
    id: "black-811bfff86d96d30c",
    text: "_____ it; ship it.",
    pick: 1
  },
  {
    id: "black-6d5a1c677e143003",
    text: "_____ just got pwned.",
    pick: 1
  },
  {
    id: "black-52f1c6a7431f41c2",
    text: "_____ makes robots move",
    pick: 1
  },
  {
    id: "black-35f278fdb31c2f25",
    text: "_____ makes the CEO happy.",
    pick: 1
  },
  {
    id: "black-503d981f1dbed55e",
    text: "_____ nagios",
    pick: 1
  },
  {
    id: "black-6aaa687456815a9a",
    text: "_____ never use on git",
    pick: 1
  },
  {
    id: "black-afc9ef3d5fc0008c",
    text: "_____ or it didn't happen.",
    pick: 1
  },
  {
    id: "black-170beeda8920334f",
    text: "_____ over IP",
    pick: 1
  },
  {
    id: "black-dc1acf4f32f8c42a",
    text: "_____ runs Ruby as root",
    pick: 1
  },
  {
    id: "black-33172d3583419649",
    text: "_____ thought leader.",
    pick: 1
  },
  {
    id: "black-1cdd558537d0b538",
    text: "_____ took EBS down again today.",
    pick: 1
  },
  {
    id: "black-10e6e8da82607a8d",
    text: "_____ will help you remember to sanitize your database inputs.",
    pick: 1
  },
  {
    id: "black-0b6358cb0f1c94ae",
    text: "_____ will never get me a job at Microsoft.",
    pick: 1
  },
  {
    id: "black-fe6ca462e493117e",
    text: "_____ with one weird trick.",
    pick: 1
  },
  {
    id: "black-b21354c4cb449162",
    text: "_____ with this one weird trick.",
    pick: 1
  },
  {
    id: "black-c53e63e03f92528a",
    text: "_____ worked in dev.",
    pick: 1
  },
  {
    id: "black-e6b6a0e157298be7",
    text: "_____ would be so much better if we rewrote it in Clojure.",
    pick: 1
  },
  {
    id: "black-97e9e10bd3bff6f0",
    text: "_____, as one does.",
    pick: 1
  },
  {
    id: "black-ffb96990e3bbe510",
    text: "_____, is that even HA?",
    pick: 1
  },
  {
    id: "black-7bded49de59923dd",
    text: "_____, the only thing worse than recruiting spam.",
    pick: 1
  },
  {
    id: "black-bb152f5ef20cf792",
    text: "_____-Stack Developer",
    pick: 1
  },
  {
    id: "black-d2596fc0a639c997",
    text: "_____-ility",
    pick: 1
  },
  {
    id: "black-bb2f0f81b2f3a92e",
    text: "_____.  Failed to cache catalog.",
    pick: 1
  },
  {
    id: "black-ff7e9ef0479a6000",
    text: "_____. How did this ever work?",
    pick: 1
  },
  {
    id: "black-0d8e22c3fe5349b9",
    text: "_____. Oh, this was earlier than expected.",
    pick: 1
  },
  {
    id: "black-151480c3bb1d386b",
    text: "_____. What could go wrong?",
    pick: 1
  },
  {
    id: "black-255b74f7eb616290",
    text: "_____. You don't exist, go away!",
    pick: 1
  },
  {
    id: "black-aed312857f639870",
    text: "_____.io",
    pick: 1
  },
  {
    id: "black-3c6771cd2a29107f",
    text: "_____: ci or not ci?",
    pick: 1
  },
  {
    id: "black-e99307a353aebe93",
    text: "_____: the gift that keeps on giving.",
    pick: 1
  },
  {
    id: "black-c0d7da7297cbfb4a",
    text: "_____? We've got that.",
    pick: 1
  },
  {
    id: "black-d066439af38cd29a",
    text: "_____? You can safely ignore that. Usually.",
    pick: 1
  },
  {
    id: "black-d73dd6b0981d72c2",
    text: "_____SQL",
    pick: 1
  },
  {
    id: "black-7c55c3422fa381e0",
    text: "_____coin.",
    pick: 1
  },
  {
    id: "black-c181ec59712927f1",
    text: "automagical _____",
    pick: 1
  },
  {
    id: "black-6a7962add17cc1a4",
    text: "bash: command not found: _____",
    pick: 1
  },
  {
    id: "black-f1c786a7acb5d6f1",
    text: "bollocks up _____",
    pick: 1
  },
  {
    id: "black-a7985a18b22da86b",
    text: "git --_____",
    pick: 1
  },
  {
    id: "black-d0f68a19c8904a6b",
    text: "git: You are in detached _____ state.",
    pick: 1
  },
  {
    id: "black-f97fc356ea3533de",
    text: "never _____ before a demonstration",
    pick: 1
  },
  {
    id: "black-fbc475dd96b629f3",
    text: "npm install _____.",
    pick: 1
  },
  {
    id: "black-1d8332e9064dfb1e",
    text: "r/_____.",
    pick: 1
  },
  {
    id: "black-0858ae3af94a3bc5",
    text: "vagrant up _____",
    pick: 1
  },
  {
    id: "black-3a2ce808835d0513",
    text: "while true; do _____; done",
    pick: 1
  },
  {
    id: "black-12a2878fce4569f0",
    text: "xkcd.com just made a hilarious comic making fun of _____.",
    pick: 1
  }
] as const;

export const whiteCards: readonly WhiteCard[] = [
  {
    id: "white-66ebe0c9c9f8f346",
    text: '"Did you try turning it off and on again?"'
  },
  {
    id: "white-5617d1ab1d1dddc6",
    text: '"I destroyed the internet"'
  },
  {
    id: "white-7ed68423f992cd6c",
    text: '"I tested it"'
  },
  {
    id: "white-fb22b2f76c4cc0c1",
    text: '"Your" opinion'
  },
  {
    id: "white-ccded9c3d4bd2312",
    text: '"works on my machine" energy'
  },
  {
    id: "white-f49022348eb34851",
    text: "# FIXME: For now, just don't validate"
  },
  {
    id: "white-aed30395b31eba8c",
    text: '# we *LIE* about what happened and return a "success"'
  },
  {
    id: "white-88fa8e07e9165087",
    text: "#And right here, we'd like a miracle."
  },
  {
    id: "white-122694b9a832a6c8",
    text: "$HOME/.gem"
  },
  {
    id: "white-241b81008650d51a",
    text: "(╯°□°）╯︵ ┻━┻"
  },
  {
    id: "white-0adfb72c764d3765",
    text: "/cgi-bin/php5"
  },
  {
    id: "white-62961d354fda5f6f",
    text: "/dev/null"
  },
  {
    id: "white-4d1dfa3e01228e41",
    text: "/dev/null as a service"
  },
  {
    id: "white-f1b90fbe635a7559",
    text: "/etc/hosts"
  },
  {
    id: "white-f3dac034052007bd",
    text: "/var/log symlinked to /dev/null"
  },
  {
    id: "white-fad690f1918362cf",
    text: "0 day exploits"
  },
  {
    id: "white-3170cf376df37bd4",
    text: "0xDEADBEEF"
  },
  {
    id: "white-ee708d5edd2ba5e8",
    text: "3 hour standups"
  },
  {
    id: "white-fffc6f91a4a521ec",
    text: "10,000 Nagios alerts per second"
  },
  {
    id: "white-07d9463495c649a9",
    text: "12 factor application"
  },
  {
    id: "white-bff8029f25227f51",
    text: "45 minutes daily standup"
  },
  {
    id: "white-5aa0c6e16852abae",
    text: "75-tier architecture"
  },
  {
    id: "white-9f5c2cf5f5db175b",
    text: "127.0.0.1"
  },
  {
    id: "white-930b7ec29dbb0f17",
    text: "2400 baud modem"
  },
  {
    id: "white-17a069e28aa450b1",
    text: ":(){ :|:&};:"
  },
  {
    id: "white-361abfa6b57293f2",
    text: ":(){:|:&};:"
  },
  {
    id: "white-41eeabe273d68fec",
    text: "@echo off"
  },
  {
    id: "white-68fec7bde29f0a3a",
    text: "A/B testing"
  },
  {
    id: "white-8641f40f8ca64e82",
    text: "AI Hackathon"
  },
  {
    id: "white-de473d70a04587d3",
    text: "AI-generated unit tests"
  },
  {
    id: "white-4e232d303c779e71",
    text: "ASAP"
  },
  {
    id: "white-a64a208064c32307",
    text: "Active Directory"
  },
  {
    id: "white-c010bfd7ff9f39f8",
    text: "ActiveMQ"
  },
  {
    id: "white-62257bf0b1f22d6d",
    text: "AngularJS"
  },
  {
    id: "white-bc0c85f9c958aec8",
    text: "Apache 1.2 running as root"
  },
  {
    id: "white-b856a73fbbb03fcd",
    text: "Apache Zookeeper on a 286"
  },
  {
    id: "white-ff13013766f76b87",
    text: "BOFH"
  },
  {
    id: "white-0c94dfd275640774",
    text: "Banana Pi"
  },
  {
    id: "white-b44b3f4c8583ad1a",
    text: "Bitbucket"
  },
  {
    id: "white-b2bf3b9ab6baeaea",
    text: "CAP Theorem"
  },
  {
    id: "white-4b1a9fc998aca068",
    text: "CEOs with root access"
  },
  {
    id: "white-b805b8296804c077",
    text: "CFLAGS"
  },
  {
    id: "white-df3595d6d2643da3",
    text: "COBOL"
  },
  {
    id: "white-8336d61b6b840f7b",
    text: "CORS headers"
  },
  {
    id: "white-c106b401f9235416",
    text: "COTS Shareware"
  },
  {
    id: "white-df6656b0af1c8aec",
    text: "ChatOps"
  },
  {
    id: "white-41e0e1d56aace548",
    text: "Church of the Flying Spaghetti Monster"
  },
  {
    id: "white-516dc6e914918c54",
    text: "Comic-Con"
  },
  {
    id: "white-7116159d18119181",
    text: "CouchDB"
  },
  {
    id: "white-235b7bdfd8e336c4",
    text: "DNS"
  },
  {
    id: "white-b1567717e55ae66e",
    text: "Daniel J. Bernstein"
  },
  {
    id: "white-f59bac07c22d1947",
    text: "Darude - Sandstorm"
  },
  {
    id: "white-7d0c3380cbf99eaf",
    text: "Dennis Ritchie"
  },
  {
    id: "white-8cb7046c85ab57ee",
    text: "DevOps"
  },
  {
    id: "white-6261155bdef61720",
    text: "DevOps Days"
  },
  {
    id: "white-366bd1ddbadaf9ac",
    text: "DevOps Engineers"
  },
  {
    id: "white-9a6437c6561980a9",
    text: "DevSecOps"
  },
  {
    id: "white-b4df57972dd09832",
    text: "Digital Ocean"
  },
  {
    id: "white-07d9a24af04a72f1",
    text: "Docker"
  },
  {
    id: "white-1287020af9006c8a",
    text: "Donald Knuth"
  },
  {
    id: "white-b29eae947d20d39c",
    text: "Elastic Load Balancers"
  },
  {
    id: "white-ee75e2fa8e7380a3",
    text: "Elasticsearch"
  },
  {
    id: "white-84d13a0ae40a46a3",
    text: "Erlang"
  },
  {
    id: "white-523f85dfbbc104dd",
    text: "Ethernet"
  },
  {
    id: "white-2f3b9e79af12436f",
    text: "FAT32"
  },
  {
    id: "white-f8ec883ca96593ae",
    text: "Friday afternoon deployment"
  },
  {
    id: "white-e9d01f4cfb06bbb2",
    text: "GCHQ"
  },
  {
    id: "white-08d60522f10b7c40",
    text: "GNU/Linux"
  },
  {
    id: "white-533591251291d8d2",
    text: "Git"
  },
  {
    id: "white-7596ae9685478163",
    text: "Git Blame"
  },
  {
    id: "white-ddf712f321e9137f",
    text: "GitHub"
  },
  {
    id: "white-a0446b15e470b714",
    text: "GitHub selfies"
  },
  {
    id: "white-21b120a6757b4709",
    text: "Golang"
  },
  {
    id: "white-596d5222e1cf8a6e",
    text: "HTML9 Responsive Boilerstrap JS"
  },
  {
    id: "white-30d6144864e4ea76",
    text: "Hacker News"
  },
  {
    id: "white-7847f5fa081cc7e2",
    text: "Hacker bootcamp"
  },
  {
    id: "white-ffc3b274fe3544d4",
    text: "Halt and Catch Fire"
  },
  {
    id: "white-78d54936598e57d7",
    text: "Haskell"
  },
  {
    id: "white-2ee2833fa0151d74",
    text: "Heartbleed"
  },
  {
    id: "white-1d54f4df2134b134",
    text: "HipChat"
  },
  {
    id: "white-7c414b6232ec1659",
    text: "I heard about it on Hacker News"
  },
  {
    id: "white-f0385615f7fd6fc9",
    text: "IE6"
  },
  {
    id: "white-16d2f59886ffabea",
    text: "IE 7 Support"
  },
  {
    id: "white-c46abd5dc9d10ad5",
    text: "IPv6"
  },
  {
    id: "white-8f8f7745eb76773a",
    text: "ISO 8601"
  },
  {
    id: "white-11028a3277779d49",
    text: "ISO 8859"
  },
  {
    id: "white-1df92e7409b0196b",
    text: "Indian Ocean"
  },
  {
    id: "white-36cef1a26295f4ff",
    text: "Java Spring"
  },
  {
    id: "white-b3d8c74da2437171",
    text: "Jenkins"
  },
  {
    id: "white-4943adaeec67c687",
    text: "Jira"
  },
  {
    id: "white-f0a7c070ec51cc36",
    text: "KISS"
  },
  {
    id: "white-f52a93707661b53f",
    text: "Kubernetes"
  },
  {
    id: "white-9aaf04ff4d6b281c",
    text: "LART"
  },
  {
    id: "white-929a537346a3896b",
    text: "Larry Ellison"
  },
  {
    id: "white-88e3b1289fce0fb5",
    text: "LevelDB"
  },
  {
    id: "white-88027fba17525820",
    text: "LinkedIn"
  },
  {
    id: "white-e44df510381c759c",
    text: "Linus Torvalds"
  },
  {
    id: "white-c95c9ed0ebcb0f62",
    text: "LogFiles\\W3SVC1"
  },
  {
    id: "white-300159e383dc737c",
    text: "Lucky13"
  },
  {
    id: "white-056b5a77ad903e6d",
    text: "Maven"
  },
  {
    id: "white-74577d791ed9acec",
    text: "Maven downloading the entire internet"
  },
  {
    id: "white-ead28ce6d52b0bc1",
    text: "Microsoft Access over a WAN"
  },
  {
    id: "white-78c2c577d2f96a89",
    text: "Microsoft® Azure"
  },
  {
    id: "white-07c95440862da805",
    text: "Minecraft"
  },
  {
    id: "white-0bbcda930f3ee098",
    text: "MongoDB"
  },
  {
    id: "white-804c9190f5eefec4",
    text: "MySQL"
  },
  {
    id: "white-607dbfaf83b6143a",
    text: "NAT allergy"
  },
  {
    id: "white-41de051b4276b53e",
    text: "NPM"
  },
  {
    id: "white-cabe472f5bd72b17",
    text: "Nagios"
  },
  {
    id: "white-8cf0b7cd309add90",
    text: "Netscape Navigator 3.2 support"
  },
  {
    id: "white-5316d66f8fc273bd",
    text: "NoOps"
  },
  {
    id: "white-187ee0dcdfe8aaa6",
    text: "NoQA Movement"
  },
  {
    id: "white-3ab8ab78a887e794",
    text: "NoSQL"
  },
  {
    id: "white-5a64d271a92e6471",
    text: "Node.js"
  },
  {
    id: "white-feaf4b7a794777dd",
    text: "NullPointerException: null"
  },
  {
    id: "white-351c60439549c083",
    text: "Nyan Cat"
  },
  {
    id: "white-9a8b8ccf4c69dd1a",
    text: "O'Reilly"
  },
  {
    id: "white-0d3b44c24b2b9a66",
    text: "OAuth"
  },
  {
    id: "white-851322321deb771c",
    text: "Office Space"
  },
  {
    id: "white-8d132b4b2a382c2f",
    text: "OpenLDAP"
  },
  {
    id: "white-2c4b10f8b5be47a4",
    text: "OpenSSL"
  },
  {
    id: "white-ee9d97f065d2540e",
    text: "Oracle Database"
  },
  {
    id: "white-d59466234166fe51",
    text: "PC LOAD LETTER"
  },
  {
    id: "white-cae00f81dfe29d2c",
    text: "PEBKAC"
  },
  {
    id: "white-f5ccb508d15a817e",
    text: "PHP"
  },
  {
    id: "white-871080280a5848b4",
    text: "PIP"
  },
  {
    id: "white-a86e8302c88349a4",
    text: "PagerDuty configured with a random number generator"
  },
  {
    id: "white-94eed45885c40b46",
    text: "Paul Graham"
  },
  {
    id: "white-6a1b2d98bdb0d8fb",
    text: "Paxos"
  },
  {
    id: "white-456059c2d4b2e7cf",
    text: "Perl 6"
  },
  {
    id: "white-b375e2ec125b717d",
    text: "PyPy"
  },
  {
    id: "white-73e16dfc07acb4f4",
    text: "Python"
  },
  {
    id: "white-4137cd4a31140fcf",
    text: "Python datetime module"
  },
  {
    id: "white-c72bf9e573861c24",
    text: "RAID 0"
  },
  {
    id: "white-c952c7bd61ca5a13",
    text: "RAID 3 SSD cluster"
  },
  {
    id: "white-ed2c0c33b59770c5",
    text: "RFC1178"
  },
  {
    id: "white-76662b567a07dcf1",
    text: "RFC 1149"
  },
  {
    id: "white-35203f3b0d0b3974",
    text: "RFC 2324"
  },
  {
    id: "white-c30ab822855c88ec",
    text: "RHEL4"
  },
  {
    id: "white-51ce4586e9a74ae4",
    text: "RTFM"
  },
  {
    id: "white-8d33e0cf6c7ca90f",
    text: "Raspberry Pi"
  },
  {
    id: "white-ddea8ecc244950bb",
    text: "Ruby"
  },
  {
    id: "white-6c7194d4660147b9",
    text: "SAP"
  },
  {
    id: "white-1131e0c92878aa21",
    text: "SIGHUP"
  },
  {
    id: "white-d93b8650e82eb533",
    text: "SIGKILL"
  },
  {
    id: "white-c8cca38261ef895d",
    text: "SOAP"
  },
  {
    id: "white-2506f7fabc852d1c",
    text: "SQLite"
  },
  {
    id: "white-b3a78b01b145209d",
    text: "Salesforce"
  },
  {
    id: "white-e42cc2fa38c2c553",
    text: "Scala"
  },
  {
    id: "white-ed3a9bcd89ed8902",
    text: "Sentinel System Driver"
  },
  {
    id: "white-1291fd4a01472fdc",
    text: "ServiceNow"
  },
  {
    id: "white-c150877c9da58f7e",
    text: "SharePoint"
  },
  {
    id: "white-3551b18d2a0eee49",
    text: "Slack"
  },
  {
    id: "white-7072572e1411fbfb",
    text: "StackOverflow is offline?!"
  },
  {
    id: "white-1b650e04caf48524",
    text: "Steve Jobs"
  },
  {
    id: "white-92892b9512433eff",
    text: "Systemd"
  },
  {
    id: "white-b5bc45676913d9d1",
    text: "THE MAGMA PEOPLE ARE WAITING FOR OUR MISTAKES."
  },
  {
    id: "white-2202ea26a948d442",
    text: "Tcl"
  },
  {
    id: "white-c2e592f80f1e27d9",
    text: "TeamCity"
  },
  {
    id: "white-724166dd46d3f737",
    text: "Terraform"
  },
  {
    id: "white-4fb4d3c78fd38845",
    text: "Tor"
  },
  {
    id: "white-1d3967a1a372cf6e",
    text: "Trello board"
  },
  {
    id: "white-dd8c31f841af5512",
    text: "Twitter"
  },
  {
    id: "white-57191605b685a881",
    text: "TypeScript errors as a lifestyle"
  },
  {
    id: "white-c2c78cf73b0469be",
    text: "UTF-7"
  },
  {
    id: "white-3aa2986c993a44fa",
    text: "UTF-9"
  },
  {
    id: "white-14373ffa2e7668d5",
    text: "Vagrant"
  },
  {
    id: "white-fcb0a621df95c583",
    text: "VisualBasic DLLs"
  },
  {
    id: "white-39263aab7861dbe1",
    text: "WONTFIX"
  },
  {
    id: "white-e450fa4e7d9ca3bf",
    text: "WebSphere"
  },
  {
    id: "white-1c731c824f2afca3",
    text: "Windows ME"
  },
  {
    id: "white-168cdeeb91936e7b",
    text: "Windows XP"
  },
  {
    id: "white-9427bbcd3d6fd0ff",
    text: "WordPress"
  },
  {
    id: "white-512bea14f77680be",
    text: "XML"
  },
  {
    id: "white-8b2b58ddd9f37d29",
    text: "Y Combinator"
  },
  {
    id: "white-ec84f0a5c801d595",
    text: "YAML"
  },
  {
    id: "white-6a922fd36d6ccb74",
    text: "YoloDB"
  },
  {
    id: "white-f94bd5dcdb63fc8e",
    text: "ZeroMQ over SSH"
  },
  {
    id: "white-342232ecfa64b0f6",
    text: "\\LaTeX"
  },
  {
    id: "white-535267afe96fd457",
    text: "a 2 AM Zoom call about latency"
  },
  {
    id: "white-dcef0514bfa0b314",
    text: 'a 3.5" floppy disk'
  },
  {
    id: "white-fa9c9885b8c5a6ef",
    text: "a 50k line Bash script that's achieved self awareness"
  },
  {
    id: "white-20e5cff753cf5701",
    text: "a 500-megabyte UDP packet"
  },
  {
    id: "white-7c058128ce430fdb",
    text: "a 1996 Java applet"
  },
  {
    id: "white-72780e88c2083b77",
    text: 'a "MRW" animated gif'
  },
  {
    id: "white-c033f84f550e180e",
    text: 'a "small refactor" that consumed the quarter'
  },
  {
    id: "white-22cf745ef123fe95",
    text: "a $60 QNAP and some positive thinking"
  },
  {
    id: "white-50e075f5a0478a50",
    text: "a CORBA service written in Ada which communicates using JSONx"
  },
  {
    id: "white-a20922f32ac85bf7",
    text: "a CSV with executive influence"
  },
  {
    id: "white-3e636d2724353c18",
    text: "a Certified SCRUM Master"
  },
  {
    id: "white-c1fb47ed6e3bb79e",
    text: "a Cisco router with a flaky chip"
  },
  {
    id: "white-a83e83420a2bcf74",
    text: "a Figma design that violates physics"
  },
  {
    id: "white-f8467c0b4ee31d80",
    text: "a German installation of Windows NT4"
  },
  {
    id: "white-91579f47a6b05af7",
    text: "a GitHub Outage"
  },
  {
    id: "white-3969487633f52516",
    text: "a JAR full of spaghetti"
  },
  {
    id: "white-b6b7648d6a8ab2ac",
    text: "a Jenkinsfile"
  },
  {
    id: "white-3b045d5ecd4c1ad9",
    text: "a Null-modem cable"
  },
  {
    id: "white-cf57f79a256b873d",
    text: "a PM's emergency ask"
  },
  {
    id: "white-aa053b6583026e1e",
    text: 'a PR description that just says "misc fixes"'
  },
  {
    id: "white-44fa3136625699e5",
    text: "a Piñata full of error messages"
  },
  {
    id: "white-0a82745041bf9106",
    text: "a README from a more confident era"
  },
  {
    id: "white-7f3cd91ae62c4873",
    text: "a Redis instance with trust issues"
  },
  {
    id: "white-9a8651b1e4bddb8a",
    text: "a Slack thread serving as critical infrastructure"
  },
  {
    id: "white-12c7427328a6aaa7",
    text: "a TODO comment old enough to mentor interns"
  },
  {
    id: "white-567d30118d22d341",
    text: 'a TODO marked "temporary" from 2019'
  },
  {
    id: "white-a21870a401e92a2f",
    text: "a Temporal activity heartbeat powered by anxiety"
  },
  {
    id: "white-680f475a556e2a35",
    text: "a Temporal activity retrying with inappropriate confidence"
  },
  {
    id: "white-6b6b9ba2271c7b10",
    text: "a Temporal child workflow with main-character energy"
  },
  {
    id: "white-091f55b59eb84eb5",
    text: "a Temporal continue-as-new habit"
  },
  {
    id: "white-80a1a67e96279885",
    text: "a Temporal cron workflow with no concept of weekends"
  },
  {
    id: "white-096a9f36e784af77",
    text: "a Temporal deployment that taught us about determinism"
  },
  {
    id: "white-c9b2ecc8b56bc8da",
    text: "a Temporal namespace full of unfinished business"
  },
  {
    id: "white-0b279eab9d59db88",
    text: "a Temporal signal arriving at the worst possible time"
  },
  {
    id: "white-642ec3aef9f834ea",
    text: "a Temporal task queue with abandonment issues"
  },
  {
    id: "white-9738e9f6cbfba45c",
    text: "a Temporal worker politely ignoring backpressure"
  },
  {
    id: "white-00cb12d7740f4a27",
    text: "a Temporal workflow history long enough to qualify as literature"
  },
  {
    id: "white-e7825ef790615b91",
    text: "a Temporal workflow nobody wants to explain"
  },
  {
    id: "white-ffc76dc4d9a4d8b3",
    text: "a Temporal workflow powered by durable optimism"
  },
  {
    id: "white-15ba144f0c3dd625",
    text: "a Temporal workflow replaying my worst decisions"
  },
  {
    id: "white-9af4b4277a3efe9c",
    text: "a Temporal workflow that survived three deploys and one identity crisis"
  },
  {
    id: "white-49bf6a2e4c9d7ca8",
    text: "a Temporal workflow upgrade nobody tested on replay"
  },
  {
    id: "white-1551150277c7b91f",
    text: "a Temporal workflow waiting on human input forever"
  },
  {
    id: "white-61790ce1dc9f8162",
    text: "a Temporal workflow waiting patiently for product to decide"
  },
  {
    id: "white-381dd699a0579407",
    text: "a Temporal workflow with an event history like a Russian novel"
  },
  {
    id: "white-d53add85eacbd1c6",
    text: "a Temporal workflow with commitment issues"
  },
  {
    id: "white-838ee0612da0c0e1",
    text: "a WSDL from 2003"
  },
  {
    id: "white-9a945a0e221e3fce",
    text: "a backend service named after a bird"
  },
  {
    id: "white-7bf351c96b0a3d4d",
    text: "a backend-for-frontend for the frontend's frontend"
  },
  {
    id: "white-aaaf846e14fe3399",
    text: "a benchmark optimized for applause"
  },
  {
    id: "white-498ac623bc0bb8a5",
    text: "a board deck full of ARR fantasies"
  },
  {
    id: "white-41ab0832eb5fdbbd",
    text: "a broken local dev environment"
  },
  {
    id: "white-317086762162eedb",
    text: "a budget alert no one had permission to fix"
  },
  {
    id: "white-ef5452ab2ced9ccb",
    text: "a build pipeline powered by optimism"
  },
  {
    id: "white-ccbf335244d86416",
    text: "a button that moved and ruined the quarter"
  },
  {
    id: "white-57206ca32f7a1964",
    text: "a cache invalidation strategy based on prayer"
  },
  {
    id: "white-288ba1b23ab347c2",
    text: "a cache that only breaks on your machine"
  },
  {
    id: "white-2f981d64973d1cd3",
    text: 'a calendar invite titled "quick sync" with 14 attendees'
  },
  {
    id: "white-501f03628f67b7cd",
    text: "a canary deploy dying for our sins"
  },
  {
    id: "white-f4fd1f9133c7555d",
    text: "a canary deploy with no sense of self-preservation"
  },
  {
    id: "white-2cc7941fcd326f93",
    text: "a changelog written like a hostage note"
  },
  {
    id: "white-d493613cb0167c45",
    text: "a chatbot escalation path to a tired engineer"
  },
  {
    id: "white-422d44ebfaef47fe",
    text: "a cloud architecture held together by naming conventions"
  },
  {
    id: "white-4ded9e7fcc89cbea",
    text: "a cloud bill that demands respect"
  },
  {
    id: "white-04bc0626350bfd65",
    text: "a cloud invoice with surprise mechanics"
  },
  {
    id: "white-c143c982986914d8",
    text: "a cluster of applications on a cluster of servers"
  },
  {
    id: "white-6cea0b95807de8fa",
    text: "a code review that became group therapy"
  },
  {
    id: "white-655701df767b58c8",
    text: 'a code review that starts with "nit:"'
  },
  {
    id: "white-2f89e104de8b15ad",
    text: "a cold cup of coffee"
  },
  {
    id: "white-cf2e2f99dd598f37",
    text: 'a comment that just says "magic happens here"'
  },
  {
    id: "white-6508114e03f370f8",
    text: "a compliance checkbox standing between us and launch"
  },
  {
    id: "white-2e755aec4e646f0f",
    text: "a compliance checkbox with teeth"
  },
  {
    id: "white-5b7cb1ababa63d2e",
    text: "a confidence score that only made things worse"
  },
  {
    id: "white-26abb44e8db804b0",
    text: "a constructor for RandomThing"
  },
  {
    id: "white-882611a2ceabdce3",
    text: "a contractor that tells you it was a real learning experience"
  },
  {
    id: "white-83b3bb48b72b85c3",
    text: "a control that exists mostly in theory"
  },
  {
    id: "white-d6c427ec24354479",
    text: "a cost optimization plan that increased costs"
  },
  {
    id: "white-06c24e1fd06b0e2c",
    text: "a cron job maintained through folklore"
  },
  {
    id: "white-e59fe9e7d911a6ae",
    text: "a cron job that reboots the server every 5 minutes"
  },
  {
    id: "white-ea732b2f458d44ae",
    text: "a cron job with tenure"
  },
  {
    id: "white-1b84648621f02e9c",
    text: 'a customer reproduction step that starts with "somehow"'
  },
  {
    id: "white-907a9b135f8bef32",
    text: "a dashboard filtered to tell a better story"
  },
  {
    id: "white-7fc2ed5812fffbf1",
    text: "a dashboard that insists everything is healthy"
  },
  {
    id: "white-d7930e832be40ad0",
    text: "a dashboard with strong opinions and no data"
  },
  {
    id: "white-255c72ede5037dd2",
    text: "a decision recorded only in someone's memory"
  },
  {
    id: "white-586a3ad166073637",
    text: "a dependency tree shaped like a cry for help"
  },
  {
    id: "white-0b6eafbcb04580a9",
    text: "a design review with no surviving decisions"
  },
  {
    id: "white-beb057807c626592",
    text: "a deterministic function with chaotic energy"
  },
  {
    id: "white-7cc0bd7bcb0d68b6",
    text: "a dev container full of fresh disappointment"
  },
  {
    id: "white-9934104d66acf2a7",
    text: "a distributed tracing bill"
  },
  {
    id: "white-f60a2716f2bcdc97",
    text: "a dozen vendor t-shirts"
  },
  {
    id: "white-cd62312d3b357d52",
    text: "a durable execution of poor judgment"
  },
  {
    id: "white-21bc942fa3c4cdf3",
    text: "a failing GitHub Actions workflow"
  },
  {
    id: "white-81c5f951c891f4fb",
    text: "a feature flag nobody remembers enabling"
  },
  {
    id: "white-961d2c3adb8cacb9",
    text: "a feature flag stuck on in production"
  },
  {
    id: "white-dab275abc1ad1761",
    text: "a feature request from someone who does not use the product"
  },
  {
    id: "white-463f7e90850d5f04",
    text: "a few instances"
  },
  {
    id: "white-641db5fce3b572e4",
    text: "a firewall full of holes"
  },
  {
    id: "white-43b4fdd5d20eb00f",
    text: "a flaky end-to-end test"
  },
  {
    id: "white-f2e55d0a616e23a4",
    text: "a flaky test with a strong personality"
  },
  {
    id: "white-23e6ca6fade3bd4b",
    text: "a force-push to the release branch"
  },
  {
    id: "white-e5c15a2764dcf1b0",
    text: "a fridge filled with Club-Mate"
  },
  {
    id: "white-c73caa0c45c400f2",
    text: "a global write lock"
  },
  {
    id: "white-3beabe96a3e532a6",
    text: "a graph that killed the roadmap"
  },
  {
    id: "white-0c6f3ae53d7f3504",
    text: "a guardrail that gave up immediately"
  },
  {
    id: "white-06b40ff9dbffbbd7",
    text: "a hallucination labeled as product intuition"
  },
  {
    id: "white-efbfd057a2fb367b",
    text: "a hand-crafted YAML monstrosity"
  },
  {
    id: "white-c7c39c74fd1f47ba",
    text: "a handoff document nobody signed off on"
  },
  {
    id: "white-f28fd2ab51923e82",
    text: "a home-rolled systemd replacement"
  },
  {
    id: "white-681cb44001d0965d",
    text: "a hotfix on top of a hotfix"
  },
  {
    id: "white-824303dbb3b37c12",
    text: "a hotfix that achieved room temperature"
  },
  {
    id: "white-0edc40808df38c6a",
    text: "a human-in-the-loop step scheduled for next quarter"
  },
  {
    id: "white-7acb44413e427ce7",
    text: "a jailbroken iPad"
  },
  {
    id: "white-71f7d7328fa3283b",
    text: "a laptop fan doing incident response"
  },
  {
    id: "white-0523452f1d971267",
    text: "a late-stage refactor"
  },
  {
    id: "white-8692c8d42bc4527f",
    text: "a latency budget consumed by tokens"
  },
  {
    id: "white-13a14ae43f1dff3a",
    text: "a local setup guide with 23 steps"
  },
  {
    id: "white-21a93b43d00ef473",
    text: "a local setup script with opinions"
  },
  {
    id: "white-bfeccecfc35af458",
    text: "a log line with no useful fields"
  },
  {
    id: "white-b8780ef1124b93ff",
    text: "a manual review queue disguised as automation"
  },
  {
    id: "white-e0f2c4ceec818517",
    text: "a meeting notes doc with conflicting truths"
  },
  {
    id: "white-9d253740cd5d98b6",
    text: "a merge conflict that somehow involves legal"
  },
  {
    id: "white-ed6bb2deac496110",
    text: "a merge queue nobody understands"
  },
  {
    id: "white-6de9e7b86b0013e4",
    text: "a metric nobody can define the same way twice"
  },
  {
    id: "white-7a3b20a19d3456e8",
    text: "a microservice with a fear of commitment"
  },
  {
    id: "white-aba3e8473ad45964",
    text: "a migration plan with no rollback"
  },
  {
    id: "white-2e24988f1b33fa08",
    text: "a migration script that believes in itself"
  },
  {
    id: "white-aa51bbea2dffd602",
    text: "a migration with no rollback plan"
  },
  {
    id: "white-4f1db3809fccb807",
    text: "a missing semicolon"
  },
  {
    id: "white-baecd5fb5d34d9d2",
    text: "a mobile web 2.0 RIA"
  },
  {
    id: "white-f79b6924a96c6fdd",
    text: "a model card nobody read"
  },
  {
    id: "white-12d4773fa9a380ec",
    text: "a model evaluation spreadsheet with vibes-based scoring"
  },
  {
    id: "white-22f9b1e9c3a7867c",
    text: "a model fallback path nobody tested"
  },
  {
    id: "white-7ce1f6bd28ce12bc",
    text: "a monitoring alert tuned to maximum anxiety"
  },
  {
    id: "white-ace5853783a27844",
    text: 'a monolith wearing a fake mustache labeled "platform"'
  },
  {
    id: "white-29c785353f49733a",
    text: "a monorepo migration"
  },
  {
    id: "white-2362ce0a2912aab6",
    text: "a new printer."
  },
  {
    id: "white-694fe39b6b081897",
    text: "a non-ironic BSOD"
  },
  {
    id: "white-012e8c2fd5a97c72",
    text: "a package-lock merge conflict"
  },
  {
    id: "white-8a8592aa048441e1",
    text: "a pimply faced youth with nothing to lose"
  },
  {
    id: "white-381f942549859efe",
    text: "a pixel-perfect mockup for an impossible workflow"
  },
  {
    id: "white-be1fdcea7d5216a4",
    text: "a plugin nobody can remove because nobody knows why it exists"
  },
  {
    id: "white-8cb250abf1116283",
    text: "a policy written after the incident"
  },
  {
    id: "white-ee6869f8a3d4e26f",
    text: "a port conflict with seniority"
  },
  {
    id: "white-0a43fa140b32fe8c",
    text: 'a posting on Craigslist "internet engineers" jobs forum'
  },
  {
    id: "white-dcb79005fc107f47",
    text: "a postmortem with no surviving witnesses"
  },
  {
    id: "white-690d5132175c9576",
    text: "a potato"
  },
  {
    id: "white-2fa15717bc511779",
    text: "a pricing model designed by coincidence"
  },
  {
    id: "white-f3578de5a8f13ac8",
    text: "a prod-only bug"
  },
  {
    id: "white-59795231bc9b9e51",
    text: "a production fix explained entirely with hand gestures"
  },
  {
    id: "white-b6acc41646430ae7",
    text: "a prompt engineer with repo write access"
  },
  {
    id: "white-d376435d2534f5bf",
    text: "a prompt template named final_v7_real"
  },
  {
    id: "white-560fc6e255217775",
    text: "a prompt that accidentally became the architecture"
  },
  {
    id: "white-219b8b06ff614e52",
    text: "a prompt that quietly became business logic"
  },
  {
    id: "white-db2d0eae9329e75e",
    text: "a proof that P=NP written in BASIC"
  },
  {
    id: "white-7d3aa3b40e416636",
    text: "a pseudorandom number generator"
  },
  {
    id: "white-914c7d5b8f2b37ef",
    text: "a pull request with 187 changed files"
  },
  {
    id: "white-eabdddc7e7790e7f",
    text: "a pull request with a winking smiley ;)"
  },
  {
    id: "white-f4122a7513829aaf",
    text: "a quarterly access review nobody finished"
  },
  {
    id: "white-51010dbd85b4f9e0",
    text: "a queue with no consumers"
  },
  {
    id: "white-05fe7a1a774b6dbb",
    text: "a race condition that only reproduces on Fridays"
  },
  {
    id: "white-277abdc99100d16b",
    text: "a redesign that created new legacy behavior"
  },
  {
    id: "white-ea900aa86908c80d",
    text: "a regex that should have been a conversation"
  },
  {
    id: "white-f8794cbd6e2c7261",
    text: "a release candidate with main-character energy"
  },
  {
    id: "white-4730b64f35ff915f",
    text: "a retrieval pipeline with trust issues"
  },
  {
    id: "white-36107f1566bd832f",
    text: "a retrieval result from a previous universe"
  },
  {
    id: "white-c1fc09bcba7cdab1",
    text: "a retry policy with trust issues"
  },
  {
    id: "white-edcc5758959a3188",
    text: "a revenue chart that needed context and prayer"
  },
  {
    id: "white-ff8527e279d15c20",
    text: 'a risk register entry marked "accepted" by fate'
  },
  {
    id: "white-3d97a142ac343346",
    text: "a roadmap assembled from wishful thinking"
  },
  {
    id: "white-7441ba39953e2d51",
    text: "a rollback that somehow made things worse"
  },
  {
    id: "white-80b338e2a4e012c7",
    text: "a rollout plan written directly in Slack"
  },
  {
    id: "white-0b2cddce257bc4c4",
    text: "a routing loop"
  },
  {
    id: "white-8a07535bfcea8b15",
    text: "a sad log with a mustache"
  },
  {
    id: "white-69b723eac34a5fb4",
    text: "a schema change introduced with confidence"
  },
  {
    id: "white-f6845386250969e2",
    text: "a self-aware PHP script"
  },
  {
    id: "white-a455ca62617e38e6",
    text: "a semantic versioning incident"
  },
  {
    id: "white-4e3eb38009d38ac2",
    text: "a series of tiny shell scripts"
  },
  {
    id: "white-1d7f61ab9e081f29",
    text: "a series of tubes"
  },
  {
    id: "white-de14f5b40633b406",
    text: "a server rack full of crushed dreams"
  },
  {
    id: "white-442fdf922b4f964c",
    text: "a serverless function with a full-time attitude"
  },
  {
    id: "white-d953689a7bc1047e",
    text: "a service account with mysterious historical significance"
  },
  {
    id: "white-124700d9df9e077d",
    text: "a settings page that lost the plot"
  },
  {
    id: "white-a871d20d6426a951",
    text: "a severity label chosen for emotional reasons"
  },
  {
    id: "white-b07fbc85d5f28025",
    text: "a shared document with 47 unresolved comments"
  },
  {
    id: "white-e81841d2f7c878b3",
    text: "a shared root password"
  },
  {
    id: "white-a8db633d95604aae",
    text: "a short nap"
  },
  {
    id: "white-819a9f7a7b5ed62d",
    text: "a simple 15-level Hiera hierarchy"
  },
  {
    id: "white-48a42bbfff073990",
    text: "a single point of failure named Matt"
  },
  {
    id: "white-eebf70eca10e402a",
    text: "a sprint demo built on selective truth"
  },
  {
    id: "white-ec808a47a596d172",
    text: "a sprint goal that violated several laws of physics"
  },
  {
    id: "white-64dceb109aea5aab",
    text: "a squirrel with a taste for fiber"
  },
  {
    id: "white-aa805544bc2b14df",
    text: "a staff engineer's thousand-yard stare"
  },
  {
    id: "white-7ffabba76f09fbea",
    text: "a staging environment curated by chaos"
  },
  {
    id: "white-0bbb0eafe476055f",
    text: "a stakeholder who discovered the roadmap"
  },
  {
    id: "white-d4ac96e75a537316",
    text: "a stale Confluence page"
  },
  {
    id: "white-aa1ea08cfd008a34",
    text: "a standup that could have been an email thread"
  },
  {
    id: "white-7fd893492a453ea8",
    text: "a startup pivot nobody fully understands"
  },
  {
    id: "white-d8e074e7467a1050",
    text: "a support ticket that became a cross-functional initiative"
  },
  {
    id: "white-1e3d45252563773a",
    text: "a surprise SOC 2 requirement"
  },
  {
    id: "white-193c7cd680a444ea",
    text: "a synthetic dataset with real problems"
  },
  {
    id: "white-1b29a2116724a3e1",
    text: "a test fixture older than the company"
  },
  {
    id: "white-21f1c38041f58903",
    text: "a test suite that negotiates"
  },
  {
    id: "white-e44564e834e3cd13",
    text: "a test suite that only fails for the honest"
  },
  {
    id: "white-fda1ecfa798d1083",
    text: "a third-party API held together by rate limits"
  },
  {
    id: "white-b7428a27585d5f7f",
    text: "a third-party API with seasonal moods"
  },
  {
    id: "white-bc4bbeb45b3208cd",
    text: "a three day build pipeline"
  },
  {
    id: "white-7fdd9268e1d5c407",
    text: "a ticket marked urgent by six different people"
  },
  {
    id: "white-d58ac434556202a6",
    text: "a ticket that became a lifestyle"
  },
  {
    id: "white-db25937f9999bdfb",
    text: 'a timeline described as "aggressive but achievable"'
  },
  {
    id: "white-fb63992c4a59a9da",
    text: "a tiny ounce of knowledge"
  },
  {
    id: "white-a5ef3fea1d361c63",
    text: "a torrent of Torrenters torrenting"
  },
  {
    id: "white-2326e9af6cb56e79",
    text: "a turducken made entirely of bash scripts"
  },
  {
    id: "white-3263025f71b4b9e3",
    text: "a unit test based entirely on vibes"
  },
  {
    id: "white-e0f3fdd958b7ce2c",
    text: "a user story with thriller pacing"
  },
  {
    id: "white-5c4308799bcbc3fe",
    text: "a violation of the most basic engineering principles."
  },
  {
    id: "white-527a86d164166e4c",
    text: "a virtual machine running a virtual machine until it brings on the Singularity"
  },
  {
    id: "white-1c4d83af712fb7b6",
    text: "a water buffalo"
  },
  {
    id: "white-09768ec84bc150d3",
    text: "a webhook retry storm"
  },
  {
    id: "white-d0ef5e134b49e137",
    text: "a workaround with unofficial permanent status"
  },
  {
    id: "white-0e3a24cfd615e3c2",
    text: "a workflow diagram that loops back to itself"
  },
  {
    id: "white-d1f192395418c630",
    text: "abstractions"
  },
  {
    id: "white-69d5c0122cf5803d",
    text: "accidentally querying production"
  },
  {
    id: "white-4d8f6061248ea36a",
    text: "accidentally the entire data center"
  },
  {
    id: "white-ed2329e75a303097",
    text: "agile"
  },
  {
    id: "white-47276cf1f585988c",
    text: "agony-Driven Development"
  },
  {
    id: "white-b4c1f341d6e041de",
    text: "an AI copilot with very junior energy"
  },
  {
    id: "white-51bcaa62ce3a3d84",
    text: "an AI demo that worked exactly once"
  },
  {
    id: "white-1eb2907fa21e5656",
    text: "an AI feature hidden behind three disclaimers"
  },
  {
    id: "white-cbdc67dfa3771346",
    text: "an AI feature nobody wants to own in production"
  },
  {
    id: "white-5a44261147516656",
    text: "an AI strategy with no data"
  },
  {
    id: "white-6e7b69589e2c25c5",
    text: "an Elasticsearch cluster having a normal one"
  },
  {
    id: "white-715dbb89e3a91535",
    text: "an Exchange email loop"
  },
  {
    id: "white-0b653b7d263e1519",
    text: "an IRC bot written entirely in sed"
  },
  {
    id: "white-04a8cdfeb3f7b921",
    text: "an LLM integration that quietly bypassed the roadmap"
  },
  {
    id: "white-a5a042b87f22d0b5",
    text: "an ORM query doing performance art"
  },
  {
    id: "white-55992781569d3cd5",
    text: "an RFC nobody read but everyone cites"
  },
  {
    id: "white-b29dee4498e91259",
    text: "an all-hands about runway"
  },
  {
    id: "white-5be70cf9954d7bea",
    text: "an angry badger with an electromagnet on its back"
  },
  {
    id: "white-16bae3dcbb8e5fcb",
    text: "an approval chain with delusions of grandeur"
  },
  {
    id: "white-b362fb5994e69443",
    text: "an approval process with cinematic length"
  },
  {
    id: "white-139f64b708e836a9",
    text: "an architecture diagram from two CTOs ago"
  },
  {
    id: "white-28e4ebfa006e9a30",
    text: "an architecture diagram that predates the architecture"
  },
  {
    id: "white-6cbb8760dec064fb",
    text: "an army of chaos monkeys, all carrying flamethrowers"
  },
  {
    id: "white-21f8150ef93afce5",
    text: "an audit trail with narrative ambition"
  },
  {
    id: "white-fb205a2dca29159f",
    text: "an auth flow nobody can explain"
  },
  {
    id: "white-55d93d8c64d3db19",
    text: "an autogenerated summary with fictional details"
  },
  {
    id: "white-3b0051b32c5dbda8",
    text: "an elegant solution to the wrong problem"
  },
  {
    id: "white-2ac38e17822e4746",
    text: "an entirely commented out file"
  },
  {
    id: "white-260d3d017bab528d",
    text: "an epic caffeine bender"
  },
  {
    id: "white-240eaa2378fc2d5f",
    text: "an escalation with unclear ownership and excellent timing"
  },
  {
    id: "white-26c04209700c467f",
    text: "an eval suite with aspirational coverage"
  },
  {
    id: "white-e240c829cbd044a1",
    text: "an experiment with no control group"
  },
  {
    id: "white-72263e172204ccb4",
    text: "an incident channel full of leadership"
  },
  {
    id: "white-9842cf7c07377922",
    text: "an incident channel moving faster than human thought"
  },
  {
    id: "white-0a4c9d47b784d456",
    text: "an incident channel moving through the five stages of grief"
  },
  {
    id: "white-dd92db3b2e27149a",
    text: "an integration named final-final-v2"
  },
  {
    id: "white-e51f10a654360917",
    text: "an internal tool with external consequences"
  },
  {
    id: "white-4a805f30325b070e",
    text: "an online book seller"
  },
  {
    id: "white-d5d1583c6a6ac0a8",
    text: "an optimistic locking strategy"
  },
  {
    id: "white-ca9d897f06cca35b",
    text: "an outage caused by a perfectly reasonable assumption"
  },
  {
    id: "white-996e9fbeddd42982",
    text: "an outage caused by improved observability"
  },
  {
    id: "white-e49cbf8f287b9056",
    text: "an outage graph with artistic ambition"
  },
  {
    id: "white-a5aedae6bfd1f80c",
    text: "an outage window"
  },
  {
    id: "white-a51e9367d86c06d0",
    text: "an oversized office chair"
  },
  {
    id: "white-f575e4be6fd09a91",
    text: "an uncontrollable deluge of emails"
  },
  {
    id: "white-c7a28cfbbdf12df7",
    text: "an undocumented dependency with executive presence"
  },
  {
    id: "white-9054f9bebd68d9a9",
    text: "an untested restore process"
  },
  {
    id: "white-ed689a3c75fa1e23",
    text: "animated GIF"
  },
  {
    id: "white-61296617c5c9f8c7",
    text: "arguing over the internet."
  },
  {
    id: "white-4e332968b98cb52a",
    text: "authentication and authorization"
  },
  {
    id: "white-640569c6dac09762",
    text: "automagic Metaprogramming"
  },
  {
    id: "white-9c60c0ee56b5f4c2",
    text: "automate"
  },
  {
    id: "white-8ed61e8b602ce2c2",
    text: "backdoor traffic"
  },
  {
    id: "white-673050f14c18074a",
    text: "backup plans for the backup plans"
  },
  {
    id: "white-6bad800b4dbc2c62",
    text: "bare metal"
  },
  {
    id: "white-d745d19265545c2d",
    text: "bash"
  },
  {
    id: "white-a463a3668505a31c",
    text: "beating the server into submission with your bare hands."
  },
  {
    id: "white-3edec2d6e3b196af",
    text: "beer Pong as a team event"
  },
  {
    id: "white-1933adb8b75b1cf3",
    text: "beer in the office"
  },
  {
    id: "white-df09f80d6ee7d600",
    text: "being acquired by Oracle"
  },
  {
    id: "white-8c21755c72b07f38",
    text: "being oddly specific"
  },
  {
    id: "white-1c0270c9f873793c",
    text: "big Data driven business model"
  },
  {
    id: "white-1040b439c1fe2428",
    text: "big ball of mud"
  },
  {
    id: "white-ed37dbc484a6979d",
    text: "bingo balls"
  },
  {
    id: "white-f897af019d7c5018",
    text: "bitcoin mining"
  },
  {
    id: "white-f6a558242db4c983",
    text: "black holes"
  },
  {
    id: "white-c5d0d37390957d27",
    text: "blinking ads"
  },
  {
    id: "white-e63e7607b34bf36e",
    text: "blue Screen Of Death"
  },
  {
    id: "white-17b0deff5de30bb3",
    text: "broadcom chipset"
  },
  {
    id: "white-761c43816c7213ef",
    text: "browsing StackOverflow for hours without actually looking for a solution"
  },
  {
    id: "white-5c8a0b2e74a18230",
    text: "buffer overflow"
  },
  {
    id: "white-90883ae3eddcb3b6",
    text: "burger Tuesday"
  },
  {
    id: "white-1f33f5eb98b74797",
    text: "bus error"
  },
  {
    id: "white-5cfbe08a4c5bc74b",
    text: "business logic in PowerPoint slides"
  },
  {
    id: "white-454188990448db90",
    text: "cache"
  },
  {
    id: "white-6e7019a58f07fef4",
    text: "caching"
  },
  {
    id: "white-545909f17fd2eabe",
    text: "callbacks"
  },
  {
    id: "white-f0497eb1f99f80a2",
    text: "cassandra"
  },
  {
    id: "white-b9354e930ab6cc95",
    text: "cat videos"
  },
  {
    id: "white-a94e66c1db7a0880",
    text: "catastrophic Failure as a Service"
  },
  {
    id: "white-d453fb393d3c6d6b",
    text: "catastrophic cancellation"
  },
  {
    id: "white-6447956e5dd01f4e",
    text: "cats"
  },
  {
    id: "white-3ae6ec14cecf757e",
    text: "checkpoints"
  },
  {
    id: "white-3a37d99adfb4cebe",
    text: "checksums"
  },
  {
    id: "white-1eff7cd26353f122",
    text: "circular imports"
  },
  {
    id: "white-6206c8374c7e72ab",
    text: "closures"
  },
  {
    id: "white-f0251768f288331a",
    text: "cloud 2.0"
  },
  {
    id: "white-8887995de2d98d4a",
    text: 'cloud costs described as "non-trivial"'
  },
  {
    id: "white-896085b24fde1462",
    text: "cloud-based business strategy"
  },
  {
    id: "white-5a3454103d956dec",
    text: "code monkeys"
  },
  {
    id: "white-08599e2c2253e58e",
    text: "cold leftover pizza from last week"
  },
  {
    id: "white-e5f7d079c1c4fb70",
    text: "command line options"
  },
  {
    id: "white-dbb7516287743a57",
    text: "command-line magic"
  },
  {
    id: "white-cfc9aa555e9360d7",
    text: "commenting it out"
  },
  {
    id: "white-dbb0a5cfc1d28a6c",
    text: "committing from the bar."
  },
  {
    id: "white-66fba211e675bd9a",
    text: "compilation error"
  },
  {
    id: "white-083be93bd00373db",
    text: "complex systems usually operate in failure mode."
  },
  {
    id: "white-bfc3b0409795d5f7",
    text: "composition"
  },
  {
    id: "white-24568cec78934222",
    text: "conflict minerals"
  },
  {
    id: "white-1ee1f8823e5d0d73",
    text: "consensus"
  },
  {
    id: "white-89bb907950f01c38",
    text: "continuous Disintegration"
  },
  {
    id: "white-a20381f211ea21ec",
    text: "continuous deployment"
  },
  {
    id: "white-e68e2d46a8d256a8",
    text: "continuous incineration"
  },
  {
    id: "white-c94b73571872bf14",
    text: "continuous integration"
  },
  {
    id: "white-fb40c9a134c60d4a",
    text: "copy \\& pasting from StackOverflow"
  },
  {
    id: "white-0951cf087c9a11af",
    text: "copy-on-write"
  },
  {
    id: "white-5329c9a6e6475c02",
    text: "copying the regex from Stack Overflow"
  },
  {
    id: "white-4676434353e18741",
    text: "copypasta"
  },
  {
    id: "white-340d92a870d37b04",
    text: "coroutines"
  },
  {
    id: "white-f0cf57aaf85e5e3c",
    text: "cowsay"
  },
  {
    id: "white-960b608bd12d8d79",
    text: "creating a buffer overflow"
  },
  {
    id: "white-9799027311c91569",
    text: "cron jobs that edit cron jobs"
  },
  {
    id: "white-bbfa0da953aa59c0",
    text: "crowdsourced Architecture"
  },
  {
    id: "white-d075529970bf1539",
    text: "cubism farm"
  },
  {
    id: "white-d8be3f3de48b16d8",
    text: "cuddling with ewoks"
  },
  {
    id: "white-3ccc4025aa1210d0",
    text: "culture"
  },
  {
    id: "white-38b857a2471b763b",
    text: "curl 4chan | sudo sh"
  },
  {
    id: "white-9b5c5893881370db",
    text: "curl | sh -c"
  },
  {
    id: "white-110c83f6136a7912",
    text: "customer touchpoints"
  },
  {
    id: "white-8018183ad5a7ed9e",
    text: "darknet Marketplace"
  },
  {
    id: "white-1a4a640e91179f86",
    text: "dd"
  },
  {
    id: "white-d58445b99abceef6",
    text: "de-linting source code"
  },
  {
    id: "white-2b362902726b5234",
    text: "deadlock"
  },
  {
    id: "white-965de2339f147b41",
    text: "debugging in production, respectfully"
  },
  {
    id: "white-0ce02b66dc96f960",
    text: "deduplication"
  },
  {
    id: "white-a1f650daa499816e",
    text: "degraded performance in some AWS availability zones"
  },
  {
    id: "white-99cca8e499f677f0",
    text: "deleting one cell in Excel wrecking your whole data model"
  },
  {
    id: "white-75aad3b98e64550f",
    text: "delightful"
  },
  {
    id: "white-2e682b96d4bfece8",
    text: "deodorant instead of showers"
  },
  {
    id: "white-892c97bfa0b98e08",
    text: "dependency injection"
  },
  {
    id: "white-f9014af44d9b91b0",
    text: "deploying on a Friday afternoon"
  },
  {
    id: "white-5ae834cc0eb2eb54",
    text: "deserialization"
  },
  {
    id: "white-3ecb10d011274642",
    text: "destroying your tools with your tools"
  },
  {
    id: "white-e7e705abe02b0087",
    text: "dev"
  },
  {
    id: "white-621ee399a30cd3e5",
    text: "developers"
  },
  {
    id: "white-bb952cc13a12d242",
    text: "developers! Developers! Developers! Developers!"
  },
  {
    id: "white-b55ea1f080eecd71",
    text: "displaying success messages in red color to alarm everyone"
  },
  {
    id: "white-31e140c65afc0964",
    text: "distributed Computing"
  },
  {
    id: "white-d5391a92aa8c190c",
    text: 'documentation that ends with "ask Alex"'
  },
  {
    id: "white-ad8f0bcb12b75551",
    text: "dogecoin"
  },
  {
    id: "white-af0552302c0cc3ec",
    text: "don't lick it"
  },
  {
    id: "white-b9d69b8ff29b1aa0",
    text: "done done"
  },
  {
    id: "white-db9dc59c8b996566",
    text: "dust bunnies"
  },
  {
    id: "white-3a5f1b5c57bb28bf",
    text: 'echo shell_exec("sudo ./smbkill ".escapeshellcmd($_GET[\'kill\'])." 2>&1");'
  },
  {
    id: "white-52f352f181d087f1",
    text: "ejecting USB drives unsafely"
  },
  {
    id: "white-a2a46466f6bf6e6d",
    text: "encapsulation"
  },
  {
    id: "white-2ec5be7244bdf627",
    text: "end to end encryption with a non-revocable static key"
  },
  {
    id: "white-6c6d538d8ab6adc9",
    text: "enterprise Grade Bash scripts"
  },
  {
    id: "white-dde1650d04b01487",
    text: "enterprise-ready sadness"
  },
  {
    id: "white-69c9966871787851",
    text: "event loops"
  },
  {
    id: "white-939b99ccb221e48d",
    text: "event sourcing"
  },
  {
    id: "white-4fa70bdb536f55cb",
    text: "eventual consistency"
  },
  {
    id: "white-87cbe6a21f9920e8",
    text: "eventual persistence"
  },
  {
    id: "white-8349f372dd159cdb",
    text: "f00d"
  },
  {
    id: "white-d6dd68cd5d62fa03",
    text: "fail early, fail often"
  },
  {
    id: "white-811982be5eda8186",
    text: "fan-in"
  },
  {
    id: "white-79d52eba115105f8",
    text: "fan-out"
  },
  {
    id: "white-f8ad8950cf88381c",
    text: "fast food, five times a week"
  },
  {
    id: "white-d13f41e4d2d37c77",
    text: "fat fingered"
  },
  {
    id: "white-883722e3c752526a",
    text: "feature flags"
  },
  {
    id: "white-ffdb773b7bbb438e",
    text: "flynn"
  },
  {
    id: "white-274383599ff06eef",
    text: "forcing push to master"
  },
  {
    id: "white-f0e1f0c66e144e67",
    text: "forget to lock my computer"
  },
  {
    id: "white-49a995f1fd80ae83",
    text: "fork() on Windows"
  },
  {
    id: "white-d161a58cbf5a25a2",
    text: "former employees who still have admin access to live production servers"
  },
  {
    id: "white-efefd2a58b3e49f1",
    text: "founder-mode architecture"
  },
  {
    id: "white-70c58a3dc7fae96f",
    text: "fpm"
  },
  {
    id: "white-65c159e3b02df01b",
    text: "full-stack developer"
  },
  {
    id: "white-c67019a1711895c7",
    text: "functional Reactive"
  },
  {
    id: "white-2b02c3f428f8e899",
    text: "functional programming"
  },
  {
    id: "white-9c46e4b6bdf5220d",
    text: "futures"
  },
  {
    id: "white-1235c2fd2c9d8b0e",
    text: "garbage collection"
  },
  {
    id: "white-18d3a5252caa4f6f",
    text: "generics"
  },
  {
    id: "white-21d3a4e8017e67be",
    text: "gentoo"
  },
  {
    id: "white-3ec367cbdc4d34f1",
    text: "geometric distances"
  },
  {
    id: "white-2a771ce25f8ffb5f",
    text: "git merge --force"
  },
  {
    id: "white-ea2a89d73568c92e",
    text: "git push --force"
  },
  {
    id: "white-508ada4f8307b2f4",
    text: "git reset --hard origin/master"
  },
  {
    id: "white-45431c87e8a1a124",
    text: "git submodules"
  },
  {
    id: "white-00f2edd1985b1a21",
    text: "global warming"
  },
  {
    id: "white-30662d8ed368041a",
    text: "gradle"
  },
  {
    id: "white-f00b8b6ff8f107cc",
    text: "growth hacking"
  },
  {
    id: "white-4c7c3062991f85bc",
    text: "hackathons"
  },
  {
    id: "white-f4cb231bc5874f2b",
    text: "half-open TCP connections"
  },
  {
    id: "white-4cf0bd855edfe174",
    text: "hand-crafted artisan x86 assembly code"
  },
  {
    id: "white-d1acbdff5a416802",
    text: "having the last word"
  },
  {
    id: "white-0db1ab95b6b07fd2",
    text: "heap allocation"
  },
  {
    id: "white-e1c7caa938a22bf9",
    text: "heartbeats"
  },
  {
    id: "white-56c8da9c2d44d7fe",
    text: "helm chart archaeology"
  },
  {
    id: "white-5d5ceca3fbbcda5e",
    text: "high availability"
  },
  {
    id: "white-7cbaef76f3eaafe5",
    text: "hunter2"
  },
  {
    id: "white-beb20b1eb5b9da7c",
    text: "hypervisors running hypervisors running hypervisors"
  },
  {
    id: "white-cf3359887c7e5b97",
    text: "iOS developers"
  },
  {
    id: "white-418a87837e63779d",
    text: "idempotency"
  },
  {
    id: "white-6615ba9d76782f5c",
    text: "immutability"
  },
  {
    id: "white-a49f465739e98581",
    text: "in $O(1)$"
  },
  {
    id: "white-f87951f7719cb069",
    text: "in b4 FIRST"
  },
  {
    id: "white-cdbc04beaa34d866",
    text: "indexes"
  },
  {
    id: "white-707378326d0a19e8",
    text: "interfaces"
  },
  {
    id: "white-b79c52cad62517b9",
    text: "it is always a good idea to change a running system"
  },
  {
    id: "white-990fa86e034ce5d9",
    text: "it worked on staging"
  },
  {
    id: "white-d85a93eab8d1a20b",
    text: "it's a feature"
  },
  {
    id: "white-58c0bfb3a3151dee",
    text: "java"
  },
  {
    id: "white-b01afd39ceee2635",
    text: "joins"
  },
  {
    id: "white-d56c1c028367e142",
    text: "just a minor refactoring"
  },
  {
    id: "white-01eb957b15ccbd05",
    text: "kanban"
  },
  {
    id: "white-937fea387698984b",
    text: "kernel panic"
  },
  {
    id: "white-adcfe69e31c2961f",
    text: "kill -9"
  },
  {
    id: "white-26db78febed82d04",
    text: "kill -9 -1"
  },
  {
    id: "white-ab26fba1c790c4b2",
    text: "killall -9"
  },
  {
    id: "white-f4a72d2a878442b7",
    text: "latency explained as a customer-facing feature"
  },
  {
    id: "white-dc26808f568c8a46",
    text: "layer 8 problem"
  },
  {
    id: "white-da215de9e7fb2575",
    text: "leaky abstractions"
  },
  {
    id: "white-e9762356d0a4216b",
    text: "leap second bug"
  },
  {
    id: "white-2f02c30d072ad109",
    text: "leaving the backdoor open"
  },
  {
    id: "white-2517a9e188137fea",
    text: "legacy Code"
  },
  {
    id: "white-265377285ce56274",
    text: "little Bobby Tables"
  },
  {
    id: "white-af64db2cd3538d0c",
    text: "log Shipping"
  },
  {
    id: "white-9c3a64d8c9cc325a",
    text: "lolcats"
  },
  {
    id: "white-4aab22ea3667ada9",
    text: "lolscale."
  },
  {
    id: "white-4328a61c8e9c304c",
    text: "looking like I care"
  },
  {
    id: "white-efd6604ed0f2d677",
    text: "losing the root password"
  },
  {
    id: "white-ba320a96c69fe8e2",
    text: "magic Numbers"
  },
  {
    id: "white-e95307433df6170a",
    text: "magic Smoke"
  },
  {
    id: "white-a8052ff122f09824",
    text: "magic Spray"
  },
  {
    id: "white-cbc69dee1cb1ccce",
    text: "making small changes in production"
  },
  {
    id: "white-b1aa808fe3c0babc",
    text: "malloc"
  },
  {
    id: "white-c344c68dd413c263",
    text: "map-Reduce"
  },
  {
    id: "white-9c85f69c33de5df0",
    text: "mechanically Recovered Turkey"
  },
  {
    id: "white-8ebe8d68be956657",
    text: "memegen"
  },
  {
    id: "white-1570f7307257fdab",
    text: "memoization"
  },
  {
    id: "white-e0343f69333e1328",
    text: "merge Conflicts"
  },
  {
    id: "white-9f40f7abc77503e9",
    text: "meritocracy"
  },
  {
    id: "white-2572d25b2aa67248",
    text: "metaclasses"
  },
  {
    id: "white-27ee86566a8614bc",
    text: "microservice Architecture"
  },
  {
    id: "white-e31a42a8237c577b",
    text: "microservices for emotional reasons"
  },
  {
    id: "white-db7f4dec52e15373",
    text: "mixed endianness"
  },
  {
    id: "white-9a202fe27b3b57e5",
    text: "moe"
  },
  {
    id: "white-b32f067006ae8cac",
    text: "more buzzwords than you can shake a scrum at"
  },
  {
    id: "white-274f3034c965119b",
    text: "mutation of immutable data"
  },
  {
    id: "white-dc7b75d08d128aac",
    text: "neckbeards"
  },
  {
    id: "white-1d52215244d7ee7b",
    text: "negative unit economics"
  },
  {
    id: "white-7e68482a154ee14c",
    text: "networking"
  },
  {
    id: "white-0f906556b0d02c39",
    text: "nokogiri Gem"
  },
  {
    id: "white-dbca29bf85e441c1",
    text: "not wearing pants during video chats"
  },
  {
    id: "white-da578aff9bb69887",
    text: "npm installing half the internet"
  },
  {
    id: "white-dd7109b8fd211a44",
    text: "ntpdate"
  },
  {
    id: "white-aadc9ca31a12d183",
    text: "null pointer exception"
  },
  {
    id: "white-0286f1a33fde9169",
    text: "nullability"
  },
  {
    id: "white-99f154cb328f0df1",
    text: "numactl"
  },
  {
    id: "white-21eb25845b040716",
    text: "observability that mostly observes confusion"
  },
  {
    id: "white-c74ad0c0c9268c24",
    text: "observability theater"
  },
  {
    id: "white-4a2272880efd27aa",
    text: "one giant SPOF"
  },
  {
    id: "white-09516a0f635ce5a0",
    text: "one last breaking change before lunch"
  },
  {
    id: "white-fc2c7642ab3f3e95",
    text: "opening an alpaca farm"
  },
  {
    id: "white-3fde1c614008fb26",
    text: "operations hipster"
  },
  {
    id: "white-4b13fbb00fab0c91",
    text: "operator overloading"
  },
  {
    id: "white-f4b73eeff389c554",
    text: "ops doing dev = technical debt"
  },
  {
    id: "white-6a32c606b7855e35",
    text: "optimistic transactions"
  },
  {
    id: "white-769954c9848d7f2e",
    text: "our Release Engineer"
  },
  {
    id: "white-84e217e64d6ceff2",
    text: "out-of-band access"
  },
  {
    id: "white-19e9c365539b3c7f",
    text: "overspecified requirements"
  },
  {
    id: "white-403f3ded10c188b9",
    text: "packet loss"
  },
  {
    id: "white-0f6af57179b2433e",
    text: "pagination"
  },
  {
    id: "white-83b149d4dece5258",
    text: "pareto Inefficient Nash Equilibriums"
  },
  {
    id: "white-22221da85c8a6097",
    text: "parsing HTML with regex"
  },
  {
    id: "white-8b20830ad1902e9b",
    text: "partitioning"
  },
  {
    id: "white-70d2dcadbee75a4b",
    text: "patent"
  },
  {
    id: "white-45607a537e4b68a8",
    text: "pattern matching"
  },
  {
    id: "white-06827448c30bfa12",
    text: "pdisk"
  },
  {
    id: "white-b44abfd525cfd9ed",
    text: "percussive maintenance"
  },
  {
    id: "white-79c0938a059352b2",
    text: "phpMyAdmin"
  },
  {
    id: "white-1bdd4ad5b2eed30f",
    text: "picking the best color to paint your bike shed"
  },
  {
    id: "white-9ec3f3c552f65717",
    text: "ping Pong"
  },
  {
    id: "white-4a554e85aec19e58",
    text: "pinging the broadcast address"
  },
  {
    id: "white-afd12c0a2999bc0e",
    text: "pipelines"
  },
  {
    id: "white-ce48d87ec017fa2e",
    text: "piping /var/log/messages to Twitter"
  },
  {
    id: "white-cb73d692be2c0ce0",
    text: "piping random scripts from the internet into bash"
  },
  {
    id: "white-7fec697108608ade",
    text: "playing Mario Kart... in single-player mode"
  },
  {
    id: "white-d852d348b25513e2",
    text: "please beautify"
  },
  {
    id: "white-bf535fdb7eee55be",
    text: "plugging in a USB drive correctly the first time"
  },
  {
    id: "white-fb5253e350e127dc",
    text: "ponies"
  },
  {
    id: "white-f23e862ee1d32691",
    text: "popping the stack"
  },
  {
    id: "white-fd8ed8b49095bf41",
    text: "post-mortems"
  },
  {
    id: "white-a82109756c8bd4f0",
    text: "pre caffeine typos"
  },
  {
    id: "white-98b6a4cb225a35f1",
    text: "private keys in /var/www"
  },
  {
    id: "white-a484fefe3b4ef15e",
    text: "product Managers"
  },
  {
    id: "white-5a344111b72b9479",
    text: 'production data visiting staging for "just a minute"'
  },
  {
    id: "white-0f9b8b40d2a57317",
    text: "production deployments that depend on GitHub"
  },
  {
    id: "white-137993807a15587f",
    text: "profanity in the git log"
  },
  {
    id: "white-7c16d27bfd376849",
    text: "program Management"
  },
  {
    id: "white-e3f1e3eac43fac97",
    text: "promises"
  },
  {
    id: "white-e8c88f63b10c628d",
    text: "proxy"
  },
  {
    id: "white-69af7a706db4d365",
    text: "puppet"
  },
  {
    id: "white-faef6adeff599909",
    text: "quadcopter with infrared camera"
  },
  {
    id: "white-9688ead1eeb57842",
    text: "queries"
  },
  {
    id: "white-c3ec774b5e0069aa",
    text: "quick fix"
  },
  {
    id: "white-0cc749ddf85808ce",
    text: "quick search"
  },
  {
    id: "white-b6a68d6aeb37ab19",
    text: "quoting the Big Bang Theory"
  },
  {
    id: "white-de43023fe138f2af",
    text: "r/sysadmin"
  },
  {
    id: "white-49239cdcbbe3ae93",
    text: "race conditions"
  },
  {
    id: "white-5b0b18fb6d393466",
    text: "rate limits"
  },
  {
    id: "white-ecfce3f7138f43b9",
    text: "re-implementing TCP over TCP"
  },
  {
    id: "white-2f05128a22d81d34",
    text: "re-implementing TCP over UDP"
  },
  {
    id: "white-6968f40312616be7",
    text: "re-writing deployment scripts at 2 AM"
  },
  {
    id: "white-586825af64593e87",
    text: "read-only Fridays"
  },
  {
    id: "white-d7489e271b1f7f06",
    text: "rebasing"
  },
  {
    id: "white-87e8b1957072ea5f",
    text: "rebooting All The Things"
  },
  {
    id: "white-da5151e45477446e",
    text: "redis"
  },
  {
    id: "white-87a55fee2cd9462e",
    text: "reference counting"
  },
  {
    id: "white-b8315ea7b412f5bf",
    text: "reflection"
  },
  {
    id: "white-ff0096bab3bb0623",
    text: "regex"
  },
  {
    id: "white-21a8f57d74222167",
    text: "releasing features early"
  },
  {
    id: "white-dd43243741ff8ce9",
    text: "releasing too early"
  },
  {
    id: "white-cea54661efa1f059",
    text: "remote access"
  },
  {
    id: "white-2bb68a640e6c71a2",
    text: "replication"
  },
  {
    id: "white-77aa9d545226e612",
    text: "reticulating Splines"
  },
  {
    id: "white-11b548479d9d2eaf",
    text: "retries"
  },
  {
    id: "white-ba80092b051f0c95",
    text: "reviewing pull requests"
  },
  {
    id: "white-d60b96a3ad954428",
    text: "rewriting bash scripts as CMD batch jobs"
  },
  {
    id: "white-74bee4906bc4e6d7",
    text: "righteous Anger"
  },
  {
    id: "white-8157c14d878883e0",
    text: "rm -rf /"
  },
  {
    id: "white-6dee1de9a2f6ba35",
    text: "rockstar"
  },
  {
    id: "white-e715cc7bb257a1fd",
    text: "rollbacks"
  },
  {
    id: "white-0f4271020bbc645b",
    text: "rolling Grubhub into the build failed script."
  },
  {
    id: "white-5dccb795947e581c",
    text: "rooftop barbecue party"
  },
  {
    id: "white-834a1c1f630f4b91",
    text: "rsync"
  },
  {
    id: "white-571a23bad3e97447",
    text: "runlists"
  },
  {
    id: "white-21e7672551eca4c3",
    text: "running OpenStack in production"
  },
  {
    id: "white-28e4260a0d221beb",
    text: "running a conference completely with volunteers"
  },
  {
    id: "white-f93c40777f026b03",
    text: "running out of IPv4 addresses"
  },
  {
    id: "white-b13be63603bf8be0",
    text: "sadness as a Service"
  },
  {
    id: "white-67ce266d51e0c854",
    text: "schemas"
  },
  {
    id: "white-ea05e6643dfee728",
    text: "scope Creep"
  },
  {
    id: "white-1731bfeda8c4f0bb",
    text: "script kiddie"
  },
  {
    id: "white-226c3abc7d50be50",
    text: "scrum Master"
  },
  {
    id: "white-72265747c158c9c0",
    text: "secret sauce"
  },
  {
    id: "white-ff43cd8d27037e9d",
    text: "seed-stage optimism"
  },
  {
    id: "white-fd5ce265cdf28677",
    text: "serialization"
  },
  {
    id: "white-6c33b8419e9fa86a",
    text: "server cages"
  },
  {
    id: "white-707212c5a7f36d4b",
    text: "server farms"
  },
  {
    id: "white-cbc2d19e0a30ff23",
    text: "server logs"
  },
  {
    id: "white-e6a4b72dcccbcd90",
    text: "servers that follow daylight saving time."
  },
  {
    id: "white-e8723912a7c12414",
    text: "sharding"
  },
  {
    id: "white-340872955fd1e6d9",
    text: "shared memory"
  },
  {
    id: "white-76da30501372cd6e",
    text: "side effects"
  },
  {
    id: "white-58c6e787107c6397",
    text: "significant whitespace"
  },
  {
    id: "white-120536a41261f721",
    text: "silos"
  },
  {
    id: "white-225e66ae48a11f9e",
    text: "single stepping through the kernel"
  },
  {
    id: "white-7a0ee5d7307fc0a1",
    text: "smart quotes"
  },
  {
    id: "white-23a6edacd9bdd176",
    text: "smiling a little bit too much"
  },
  {
    id: "white-f800378f6b15345e",
    text: "smokeping"
  },
  {
    id: "white-39fbb7026a13ba16",
    text: "snail scale"
  },
  {
    id: "white-87cc1068d7f290ca",
    text: "snapshots"
  },
  {
    id: "white-8dba400db8951b50",
    text: "snowflake server"
  },
  {
    id: "white-b9538b9f338ab152",
    text: "software rollback"
  },
  {
    id: "white-8a5c8c429e2a484f",
    text: "solar flares"
  },
  {
    id: "white-dcd32c162c7a6c4e",
    text: "something written in Fortran"
  },
  {
    id: "white-1d406ffde114856f",
    text: "spot Instances"
  },
  {
    id: "white-ce469677be35f36e",
    text: "sprint Planning"
  },
  {
    id: "white-7f17a7bd9b0998b6",
    text: "ssh in a for loop"
  },
  {
    id: "white-bca1c1377b03911b",
    text: "stack trace generator"
  },
  {
    id: "white-7e5ddf7b28c5c05d",
    text: "stormtroopers for quality control"
  },
  {
    id: "white-c99d1c451d217adb",
    text: "streams"
  },
  {
    id: "white-66840012989bdc21",
    text: "stringing cloudtobutt.pl into postfix."
  },
  {
    id: "white-ba2345dbe82123ee",
    text: "structured concurrency"
  },
  {
    id: "white-1d190352b39f7fed",
    text: "sudo"
  },
  {
    id: "white-a6451ee552915dd8",
    text: "sum types"
  },
  {
    id: "white-05d6259c5dbca35d",
    text: "sun rays"
  },
  {
    id: "white-601888818d361eb7",
    text: "swinging my lightsaber"
  },
  {
    id: "white-93e2a56da025b674",
    text: "synergy"
  },
  {
    id: "white-e1ae7e64c753ce34",
    text: "syntactic sugar coma"
  },
  {
    id: "white-f5239594af170943",
    text: "syntax error"
  },
  {
    id: "white-54dbb4cf1d39d00e",
    text: "sysadmins"
  },
  {
    id: "white-a0db81d4d8ca358f",
    text: "tail recursion"
  },
  {
    id: "white-f42b8b9b714354bf",
    text: "tech Debt Day"
  },
  {
    id: "white-474d587419b8eb6c",
    text: "technical Difficulties"
  },
  {
    id: "white-2c21f74e26ab0a53",
    text: "technical debt with excellent people skills"
  },
  {
    id: "white-333efc26e2ef99c7",
    text: "temporary hotfixes"
  },
  {
    id: "white-5926972cac4ee7dc",
    text: "ten layered if statements"
  },
  {
    id: "white-01c92d327c3dc0f6",
    text: "termcap"
  },
  {
    id: "white-d5e77b08f72b771c",
    text: "terraforming"
  },
  {
    id: "white-837df23eefa7d908",
    text: "testing early"
  },
  {
    id: "white-be9df11d9206890d",
    text: "testing in production"
  },
  {
    id: "white-5a34cc7384f1cf28",
    text: "testing positive for mongonucleosis"
  },
  {
    id: "white-5ef525f453ef83ab",
    text: "that XKCD comic about sysadmins"
  },
  {
    id: "white-d6bbf22ab2a72bc6",
    text: "that can't be too complicated"
  },
  {
    id: "white-adea73b39632a207",
    text: "that moment when you realize CTRL-Z cannot save you"
  },
  {
    id: "white-41efc9d3f07a2531",
    text: "the 16th internship in the 12th company"
  },
  {
    id: "white-95c429746e2e7e80",
    text: "the BOFH"
  },
  {
    id: "white-67793ff1ca85e9f1",
    text: "the Ballmer Peak"
  },
  {
    id: "white-2c5db6c0910f63b8",
    text: "the Berkshelf way"
  },
  {
    id: "white-29bfb58322da809d",
    text: "the CEO"
  },
  {
    id: "white-589e0cdec9e672cf",
    text: "the Cult of Mac"
  },
  {
    id: "white-36dfd9dec79e952d",
    text: "the Linux Kernel"
  },
  {
    id: "white-829fb1d11ca33c22",
    text: "the MySQL client"
  },
  {
    id: "white-f85408be4ed7b523",
    text: "the PM's emergency ask"
  },
  {
    id: "white-8141e8bca75f5ad9",
    text: "the Sales & Marketing department"
  },
  {
    id: "white-2d901a40552f6d6c",
    text: "the Stanford of Canada"
  },
  {
    id: "white-adcaf9f6ef17d4b6",
    text: "the dark side of the force"
  },
  {
    id: "white-f5ccbeb8c3eb4723",
    text: "the difference between machine learning and AI"
  },
  {
    id: "white-fc94febbcd005073",
    text: "the gentle sound of weeping drifting from the server room"
  },
  {
    id: "white-16b702d1bc217f20",
    text: "the ghost of technical debt future"
  },
  {
    id: "white-66960439f6b1c9f8",
    text: "the illusion of platform ownership"
  },
  {
    id: "white-75afd96920e00d1e",
    text: "the intern with production access"
  },
  {
    id: "white-f9ded3b352a56970",
    text: "the last remaining Multics server on Earth"
  },
  {
    id: "white-fe63ff3b94a5253b",
    text: "the library that imports all other libraries"
  },
  {
    id: "white-8a04397e1a87cb19",
    text: "the much neglected IPv5"
  },
  {
    id: "white-7631293bf2151d89",
    text: "the next Y2K"
  },
  {
    id: "white-a61b953061c5c3a5",
    text: "the only person who knows the billing system"
  },
  {
    id: "white-f1b940000c75ad59",
    text: 'the phrase "quick sync" at 6:30 PM'
  },
  {
    id: "white-6589f3c06eca3d99",
    text: "the unix epoch"
  },
  {
    id: "white-16afb7ef2d5f8e52",
    text: "the unpaid toil of senior engineers"
  },
  {
    id: "white-a6cc0569ceb3cd1c",
    text: "the world's only fully-functional ROFLcopter"
  },
  {
    id: "white-038f7c70fe541e37",
    text: "the world's saddest feature launch"
  },
  {
    id: "white-e5a2159ed0ea7f56",
    text: "those ksh scripts"
  },
  {
    id: "white-6f5a8506ce6f563c",
    text: "thought leadership"
  },
  {
    id: "white-037a7d1455541748",
    text: "three layers of temporary glue code"
  },
  {
    id: "white-8606f84f2179244e",
    text: "three temporary solutions in a trench coat"
  },
  {
    id: "white-d988cd446ada8769",
    text: "throttling"
  },
  {
    id: "white-4c382f8db2bc821b",
    text: "timeouts"
  },
  {
    id: "white-d73ac4095abf6401",
    text: "tiny student dorms"
  },
  {
    id: "white-fd20229859970492",
    text: "too Big Data"
  },
  {
    id: "white-f4bff1fe724ab59a",
    text: "too big to fail"
  },
  {
    id: "white-a21958b5d7e707d0",
    text: "too many authorization failures"
  },
  {
    id: "white-85d5cb40ddde5e64",
    text: "top"
  },
  {
    id: "white-6e64ac0fe346a1fd",
    text: "touch control"
  },
  {
    id: "white-18d8150a5c43a4d4",
    text: "traceroute"
  },
  {
    id: "white-815e4fa78552939e",
    text: "tracing"
  },
  {
    id: "white-dd02131ceb502c34",
    text: "traits"
  },
  {
    id: "white-b11b48d4e6d5247f",
    text: "transactions"
  },
  {
    id: "white-993d9d7ee891716f",
    text: "transpilation"
  },
  {
    id: "white-3ee0028a72b8bb8a",
    text: "tribal knowledge"
  },
  {
    id: "white-34b5b781b40826d3",
    text: "tripping the wire"
  },
  {
    id: "white-9721ddbd4e3d9187",
    text: "twenty-seven unchecked TODOs"
  },
  {
    id: "white-920e5be5cfe2207b",
    text: "two single quotes"
  },
  {
    id: "white-3d0b52099c898cdb",
    text: "type inference"
  },
  {
    id: "white-9a6f4a197aa1c426",
    text: "undefined behavior"
  },
  {
    id: "white-ab08dca33023c571",
    text: "unexpected side effects"
  },
  {
    id: "white-9d35d9e3b8306b18",
    text: "unicode errors"
  },
  {
    id: "white-1e829f5e10b49c0a",
    text: "unicorns"
  },
  {
    id: "white-2a2b41178c2d03ac",
    text: "unix philosophy"
  },
  {
    id: "white-0be5c3eb00fddadf",
    text: "unknown source in your stack trace"
  },
  {
    id: "white-02cd10cb47ce241f",
    text: "unlimited data plan"
  },
  {
    id: "white-d32c2989b581c33b",
    text: "unplugging a server and waiting to see who complains"
  },
  {
    id: "white-b47479692a6e9209",
    text: "useless meeting"
  },
  {
    id: "white-1440217b7d295fb0",
    text: "user space function calls"
  },
  {
    id: "white-a6e723dffaa81b26",
    text: "using Blockchain instead of a database"
  },
  {
    id: "white-4e7e8bb15128a8ca",
    text: "using HTML as a programming language"
  },
  {
    id: "white-b772449058e2ab05",
    text: "using Kubernetes for my static website with 100 visitors per month"
  },
  {
    id: "white-93ca877bc4c6a089",
    text: "using Tabs instead of Spaces"
  },
  {
    id: "white-fc153406a9b71e8e",
    text: "using XML instead of JSON"
  },
  {
    id: "white-293e191549dbcb2e",
    text: "using a light theme for the terminal"
  },
  {
    id: "white-c3748ce35ba33dc6",
    text: "using blockchain in every pitch"
  },
  {
    id: "white-9575608067ac4104",
    text: "using more than 10 programming languages because I can"
  },
  {
    id: "white-fc7e05911ba6c2d0",
    text: "using open source software just because it's free"
  },
  {
    id: "white-49f5b76e5c620e6b",
    text: "variance"
  },
  {
    id: "white-9d9beca9d7c8baa5",
    text: "vector clocks"
  },
  {
    id: "white-a777844632b365a1",
    text: "vegan friendly init scripts."
  },
  {
    id: "white-4c0e559458e829a8",
    text: "vendor lock Stockholm syndrome"
  },
  {
    id: "white-0577c1a6f36b3aaa",
    text: "versioning as an interpretive art form"
  },
  {
    id: "white-93b24c96cf6e769c",
    text: "waiting for console.aws.amazon.com"
  },
  {
    id: "white-3b69806feb9824d8",
    text: "wat"
  },
  {
    id: "white-d0cb555bf8a09430",
    text: "web Scale?"
  },
  {
    id: "white-d112b4d6b8489c9b",
    text: "web scale"
  },
  {
    id: "white-5c3f8a51b1f24626",
    text: "webhooks"
  },
  {
    id: "white-0b6a67a6d12ca7a8",
    text: "webscale"
  },
  {
    id: "white-78a5f44af89b723c",
    text: "whistling the Tetris theme song"
  },
  {
    id: "white-ac3f0d829b0829e4",
    text: "winking at old people"
  },
  {
    id: "white-0afcbec48b4f7688",
    text: "winning because of psychological warfare"
  },
  {
    id: "white-03ca115a05a04539",
    text: "winsock"
  },
  {
    id: "white-e113aecdd3b1d6ad",
    text: "works for me"
  },
  {
    id: "white-4cb22d48356df080",
    text: "works on my machine!"
  },
  {
    id: "white-4f42fcdcd4a9152e",
    text: "write-only code"
  },
  {
    id: "white-ceb83b25ebbd5730",
    text: "writing code without my supervisor telling me what to do"
  },
  {
    id: "white-d4db73386ff1b285",
    text: "year 2038"
  },
  {
    id: "white-23e87ecf7f40ce5e",
    text: "yet another package manager"
  },
  {
    id: "white-77f0a196f7e32ff7",
    text: "your Mum"
  },
  {
    id: "white-13abaecf8307b527",
    text: "your account"
  },
  {
    id: "white-172a19a178d361ff",
    text: "your code featured on The Daily WTF."
  },
  {
    id: "white-4ecaafdf74576f4a",
    text: "your private browsing history"
  },
  {
    id: "white-b80c8e30dbcf7f7b",
    text: "zombie processes"
  },
  {
    id: "white-c248d1840a06fbf8",
    text: "zsh"
  }
] as const;
