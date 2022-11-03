<--[Back](https://ussf-orbit.github.io/ussf-portal/portal-updates)

# Space Force Development Updates

---

## Week of 1/10

Happy New Year!

**What we’ve been working on:**

The team launched a beta version of the portal!!!

Guardians can now preview the beta version of the portal by clicking on the Join Beta links on the current portal homepage.

We want to encourage everyone to join the beta so they can explore its features and provide any feedback they may have.

Some of our early feedback has been great to be able to revisit how we manage the user experience when it comes to editing link collections and reordering links once they have been added to a user’s personalized page. This is leading us to compile all the quantitative and qualitative usability data we’ve gathered through the previous rounds of research.

Engineering is working on several fast-follow items to push to the beta portal since we’ve launched the new experience. These are improvements to the user experience, analytics opportunities and new methods for deploying the code to make every future release faster and easier for the team.

The team created a microsite containing the details around how we approached this project, our design elements, what we’ve completed, and what we’re working towards in our product roadmap. 

**What’s next:**

The team will focus on the remaining items required to take the portal out of beta where the new portal will fully replace the existing, bare-bones site.  

Design and research will provide assets for future UX/UI improvements and feature work on our product roadmap.  

The engineering team will get our analytics platform up and running and migrate to a self-hosted version of our content management system (CMS). A self-hosted version of the CMS is the first step towards a system that allows us to build out the proper functionality to create and publish content.

Engineering will also focus on migrating existing content from the current version of the portal to the new design and building out the pages required for our News & Announcements section.

## Week of 12/13

**What we’ve been working on:**
Research and design wrapped up round 7 of user research. The team ran another Insights & Actions exercise that generated some fantastic conversation. Here are some of the top highlights:

* Overall, usability was very positive:
  * Deleting a link and adding a collection from the Site and Apllications page was easy to use
  * Entering the beta release from the existing portal was easily found and executed
  * Deleting a collection from My Space was easily found and executed
* We found a few areas where usability could be improved:
  * Editing the title of a collection card caused some confusion for Guardians
  * The ability to save a custom link was not as easily discoverable as we’d hoped
  * Saving a link in a collection was confusing to some Guardians
* Saving valuable or easily accessing frequently used documentation or forms appears to be a need. We will conduct more research and do some ideation around potential solutions.
* Guardians still desire more visual design
  * (This is coming shortly. We’re strategically separating functionality from visual design for the time being so that aesthetics don’t interfere with actions.)
The research and design team provided the final typography and branding elements.

The team also provided final designs for the news & announcements pages which are scheduled to be live around the start of the new year.  

The engineering team completed all of their database setup and configuration as well as authentication updates. This work allows the service member to perform two things:

* Login using their CAC in which we request for more information about the user during authentication in order to provide a more personalized experience.
* Save and persist any customizations a service member performed on the portal (i.e. add and edit custom collections and bookmarks)
The engineering team also continued making optimizations to their deployment pipeline.  

**What’s next:**
The research and design team will continue mapping out the portal design experience principles.

They will also run a few design studio sessions around feedback they received during round 7 of research for a couple of key features that raised some interaction concerns.  

The engineering team will work on adding some monitoring to the app to help with troubleshooting.

They will also continue to make any final cosmetic tweaks in preparation for the beta launch on Dec. 20th.  

The entire team will be focusing their efforts on testing and ensuring the beta launch is a success. They also will launch a microsite containing information about the purpose of the beta, our design and development processes as well as our product roadmap.

### Week of 9/27

**What we’ve been working on:**

The team rallied around getting a last minute deployment to production late night on a Friday to update the portal with announcements for the new Guardian Enlisted Rank insignia and the Guardian Ideal. This was a huge effort by the team who worked through and around a number of limitations and some general confusion to make sure the current site was updated and available. Huge kudos to the team for this effort and proving once more they are the best at what they do!

Research and design wrapped up round 5 of user research. The team ran another Insights & Actions exercise that generated some fantastic conversation. Here are some of the top highlights:

Although news was not viewed as a priority in previous rounds of research, its absence was called out in this round. Service members expected the portal to display the most “official” news and announcements vs. the discussions or rumors of news they might be reading on Reddit or Facebook.
Our repeat research participants are becoming brand ambassadors for the portal and the project. Awesome!
Participants had different expectations than we did about the word “widget” and what it might mean. For example, some users mentioned it being related to news or weather.
Several participants looked for validation that the design would be what they would see post-CAC authentication.
The research and design team has also experimented with designs around onboarding users, customization of news and announcements by filtering and other means, and what a CAC authenticated vs. unauthenticated version of the portal might include. All concept designs will be presented in the next round of user testing for feedback.

The engineering team successfully built out the Sites and Applications page and the ability to sort by collection (i.e., type) or alphabet. The team is halfway through their work on being able to delete a link from a collection and display a customizable collection on the user’s home page or “My Space.”

The engineering folks also wrapped up their initial efforts working on some of the upcoming features that allow for customization, such as adding and removing links to a collection.

**What’s next:**

The research team will continue to work on multiple design concepts for the news and announcements portion of the portal in preparation for round six of user interviews.

The design and research folks will also develop lean experiments to understand the implicit and explicit needs of an unauthenticated version of the service portal.

The engineering team will continue to wrap up the work around the Sites & Applications pages with the ability to add/remove a link to a collection and add/remove an entire collection to their “my space.”

The engineering team will also work on the final pieces of the Sites & Applications outcome, which include searching for links, editing collection titles, and setting up the ability to display modals for displaying additional content.

### Week of 9/13

**What we’ve been working on:**

Research and design have kicked off round 5 of user research with eight participants lined up. For this round, the goal is to dive deeper into the design concepts and usability around adding, deleting, and managing links in what we’re calling collections.

The research and design team has also focused on providing assets for the engineering team to begin building out the sites and applications features.

The engineering team completed all of the necessary work to allow for the segmentation of users to the MVP and beta site. This will help once we start sending real users to the beta site for feedback in the next coming rounds of user research.

The engineering team created the necessary UI components for the portal’s sites and applications page(s). The components include the overall page layout, link collections, side nav, search, and header and footer. Lastly, the engineering team has been building out the sites and applications page with sorting and the default landing page which will house the custom collections a user will be able to manage in the future.

**What’s next:**

The research and design team will be synthesizing all the user feedback from round five of the research and host another actions and insights exercise.

The design and research folks will refine the portal color palette, typography, possible dark themes, and interaction patterns based on feedback.

The engineering team will continue constructing the sites and applications pages. This work will also include building out on the backend, the ability to add and delete links to support customization efforts.

The engineering team will also continue working on the specifics of login and authentication to help with the future customization efforts desired as part of the portal functionality.

### Week of 8/23

**What we’ve been working on:**

Research and design have been experimenting with color palettes that would be appropriate to apply to the UI design. The designers ran a few design studio sessions with the team and, based on the outcomes, have started adding the ideas around collection creation and onboarding to the current design concepts.

The research and design team is making other various updates to the UI/UX based on learnings from the most recent round of research.

Finally, research and design also started exploring dark mode theme ideas in the UI.

On the engineering side, the team completed the login page and has a release ready for the rebuilt version of the portal.

The engineering team formalized the accessibility (a11y) tools and testing plan and included the a11y check to the end-to-end testing framework.

The engineering team also started working to support the segmentation of beta pages from the existing portal to test and experiment with future features and designs. Tasks for this include creating a beta entry point and the ability to show/hide new pages and designs for beta testing.

**What’s next:**

The research and design team will be crafting the script and research plan for the next round of user research.

The design and research folks will also continue to refine the portal color palette, typography, possible dark themes, and interaction patterns based on feedback.

The engineering team will continue working towards completing the beta segmentation tasks with the ability to set a cookie for users to enter and view beta content and the ability for the users to return to the existing portal. Additionally, the team will look to add the ability to capture feedback from the beta users.

The engineering team will begin work on setting up the content management system, Keystone JS, which includes defining the data schema and models and displaying sample content on a page.

### Week of 8/9

**What we’ve been working on:**

Research and design have wrapped up their fourth round of user interviews. The goals for this round were to further clarify the mental models and expectations that Guardians have around News and Announcements. In addition, we sought to understand if our design concepts for customized link saving satisfy the explicit and implicit needs we’ve heard from service members in previous rounds of research.

Research and design also started exploring color and typography choices for the USSF brand and will apply some of these explorations to existing design work to stress test use cases and accessibility compliance.

On the engineering side, we’ve nearly completed the rebuild of the existing portal. The only remaining task covers login and authentication. The team is working on scheduling time with the folks at Akamai to discuss our implementation options.

The engineering team also continued their research on content management systems (CMS) by evaluating Directus and KeystoneJS. They have been compiling their findings and drafting an architectural decision record (ADR) on which CMS will best suit the project’s needs. We also began looking into which database(s) we should be utilizing for the project. Again, an ADR is in the works.

We have a rough draft of the roadmap covering the desired outcomes we wish to deliver across the length of the project. The roadmap will be a living thing. We’ll be continuously testing against what we’ve already delivered through analytics and user feedback to ensure we prioritize work on the things that provide the most value to the service member.

**What’s next:**

The design team will continue to experiment with the portal site designs incorporating the feedback gained from user research on the home and sites and applications pages, and explore where these findings might also fit other parts of the portal.

The design and research folks will also continue expanding on the portal branding and exploring various applications of some new branding work.

After wrapping up the decisions on which CMS and database we’ll be using, the engineering team will incorporate them into the new infrastructure.

Next, the engineering team will begin designing and building an architecture to provide experimentation and user segmentation to support controlled testing and the rollout of new features.

### Week of 7/26

**What we’ve been working on:**

Research and design have been working on refining the design concepts in preparation for another round of user testing. We've narrowed in on a single layout from having tested three different concepts in our last round of research. By starting broadly with three very different layouts and asking for user feedback, it’s given our team more confidence in the overall design direction and kept us from spinning on subjective internal points of view.
We're wrapping up our script for round four of user research. This time, we'll focus on gathering feedback around expectations for saving links to collections, news and announcements, search results, and notifications/reminders.
After the last round of card sorting synthesis, we discovered events and promotion announcements were top among information users would like to see under News and Announcements.
On the engineering side, we continued rebuilding the existing portal on the new infrastructure with the Home, About, Accomplishments, and Login pages being complete. The remaining pages, News, Training & Education, and Force Multiplier Program, will be completed early next week.
The team is nearing the end of the Discovery and Framing portion of the project. They have been building out a roadmap and backlog of user stories for the engineering team to break down into tasks ready for development.

**What’s next:**

The design team will begin recruiting, scheduling, and interviewing participants for round 4 of user research.

The design team will also continue to iterate on the prototype and assist engineering in building out the initial components for the new portal home page.

Once the portal migration is complete, the engineering team can resume publishing now that they can access the production environment.

The engineering team will help map out development timelines for the set of user outcomes we’ve agreed to and incorporated into the product roadmap.

The team will also be working on setting up the framework for implementing feature flags and controlling experiments in production.

### Week of 7/12

**What we’ve been working on:**

We completed our third round of user research which consisted of concept testing three different initial designs and unmoderated/moderated card sorts. The goals this round were to validate our information hierarchy and initial service portal features.
We conducted a total of 7 one-on-one 60-minute interviews where we asked service members to view and provide feedback on three prototype designs. The goals were to make sure we were addressing the needs and top priorities of the Space Force personnel through our initial design concepts and uncover any features which might also be a priority for them. We also asked the service members to play a game of Would You Rather, prioritizing their day-to-day sites and applications against each other to see which are most important for the SF service portal to provide links to. Finally, we asked the users to interpret and prioritize the set of problem statements we had devised from previous rounds of research.
We had 41 participants in the unmoderated card sorting exercise where we asked them to place sites & applications under a few pre-made sets of categories, but also within categories that they named themselves. From this exercise we hope to better understand how service members group the sites & applications that will live in the portal and identify any services that were not familiar or missing.
On the engineering side, we’ve been setting up our development workflow, including tools for checking code quality and running automated tests as part of continuous integration. We’ve written a couple of ADRs about our chosen application framework and rollout strategy. We have begun piecing together an engineering-oriented roadmap for the next 4-6 weeks to ensure we have the necessary architecture in place to start implementing solutions.
We also began the work to migrate the existing MVP version of the portal over to our new chosen architecture. This work has included setting up automated testing; UI development tools including Storybook, USWDS, and ReactUSWDS; migrating metadata and static assets, and beginning to create components for the header, navigation, COVID banner, announcement cards, and footer.

**What’s next:**

Engineering will complete rebuilding the current portal in the new codebase, including the About, Accomplishments, Home, Login, News, Training & Education, and Force Multiplier Program pages, and are hoping to deploy this version of the portal shortly thereafter.
Engineering will continue documenting and setting up additional infrastructure, including a CMS platform, analytics platform, and supporting databases.
Research and design will be prepping for another round of testing. In addition, they will update the existing prototypes based on the feedback we received from round 3.
Our team will run another round of Insights and Actions to sync on the latest user research and use this for another How Might We and Solutioning exercise.
The team will also run through an experience-based road mapping session to scope out our long-term experience into what we want our users to be able to do and when.

### Week of 6/28

**What we’ve been working on:**

We completed our second round of research conducting a total of 7 one-on-one 60-minute interviews. We modified our interview script for this round to include observing the service member performing a particular task (one common and one uncommon) via screen sharing. The data gathered helped solidify a few patterns we recognized from our first round of user interviews and helped us focus on what appeared to be the common pain points for service members.

We took our initial set of problem statements, refined them once more, and then ran through prioritization exercises to identify the top three problems:

There is no way (site or application) for a service member to quickly & consistently locate their immediate needs for their job role or military life.
Knowledge of which military requirements are upcoming and when takes extra thought and planning when service members already have limited cognitive bandwidth.
Service members expect common language to discover and find the sites, applications, and information they seek.
We ran an extensive How Might We & Solution Brainstorming exercise. We prioritized the problem statements discovered through research based on impact and perceived user value. Next we took the top 3 problems and generated over 100 different possible solutions, which we then also prioritized based on technical complexity and value to the user. After we had roughly narrowed our solution ideas down to the top 9, we sketched out as a group what those solutions might look like within the portal.

We compiled the results of our first card sorting exercise, where a total of 33 service members participated. Top Priority items highlighted by users as high priority for the portal included were: “Personnel actions” (100%), Career Development opportunities (94%), LeaveWeb (88%), Promotion announcements (82%), Service Records (81%), A way to save frequently used, favorite items (81%), Policy Updates (78%), View information on mandatory appointments (78%)

The engineering team has been busy discussing and writing ADRs (Architectural Decision Records) addressing our development workflow, chosen programming language(s) and framework(s), how we plan to iterate on the new portal while simultaneously supporting the existing one, and our planned overall technical architecture.

We decided on our rollout strategy. The engineering team has been helping flesh out the roadmap we’re building by mapping out all known deliverables and dependencies in order of priority.

I'm also happy to report that the two engineers studying for the Security + certification took their exams and passed! This brings us a step closer to gaining access to our infrastructure environment and resuming deploys of the existing portal.

**What’s next:**

We’ll be running our second round of card sorting. This time we'll be administering two studies. The first will be an open card sort where participants will logically sort and group a set of links to services/information under categories they define themselves. The second will be a hybrid approach where we provide 4-5 predefined categories that the participants can sort the links under. They will also be able to create new categories of their own should that make more sense to them.

Pen has met paper on the design front and we are barreling towards having a static, interactive prototype very soon! We will use these low-fidelity, lightweight wireframes in interviews to ‘concept test’ with Space Force users, our initial ideas to ensure our solutions are on the right track. As we do that work, the design team will supply the validated design assets, and then engineering will start to build and deploy them. Human-centered design for the win!

The engineering team will start rebuilding the existing portal using the new infrastructure. This approach will give us a starting point for the code that matches the current UX, provide a benchmark for tests to ensure no degradation that isn’t intentional, and resume updates to the existing portal without having to juggle two codebases/environments.

### Week of 6/14

**What we've been working on:**

We’ve been working on refining the problem statements and started mapping out common tasks and experiences with an eye towards designing the new portal. Next week we will begin to prioritize the problems we’re seeing as we fold in our second round of research, which will close on Monday.

We finished our first card sort. We identified 30 items based on what we heard in our first round of research and asked Guardians to sort them by priority. The results of this test will give us a better understanding of what is important to service members and where we might put our focus first. As of Friday, June 11, we had 31 completions!

We also put together an updated script for our second round of research, and have completed 5 out of 7 of those interviews. We are still speaking with service members across various roles and ranks, and we’re now also having participants share their screen as they walk through certain scenarios using the existing Air Force portal and related tools to help us visualize pain points in a more tangible sense. This will help as we change gears from discovery into framing, and begin designing solutions for the new Space Force portal.

The engineering team has been busy studying for a security certification required by our infrastructure environment, but we’ve found time to make progress on some initial setup and tooling decisions.

We’ve stood up and deployed a basic boilerplate website we will use for building out an interactive prototype that will help us test and validate our project decisions, as well as be a valuable tool in upcoming rounds of user research.

Additionally, we’ve begun to map out the system architecture of the new portal and its supporting applications, such as a content management system for easy maintenance, and an analytics platform to provide continuous feedback about how users interact with the portal. We continue to evaluate existing open-source platforms for both the CMS and analytics systems, with the plan to test out our preferred options as we build out the prototype.

Finally, we’ve been solidifying some logistical decisions around how to operate as a team, how and where to organize our tasks, assembling a workflow for implementing, testing, and deploying code changes, as well as discussing our eventual rollout strategy for the new portal itself.

**What's next:**

Over the next week, we’ll be transitioning into the framing phase of this project, during which we’ll start brainstorming and designing solutions for the new portal. We’ll have one eye towards prioritization to ensure we’re focusing on impactful features that can get progressively better over time.

We’ll also begin generating solution ideas, as well as continue to set up tools and supporting infrastructure to help ensure a smooth transition once we’re ready to start deploying the new portal to users.

### Week of 5/24

**What we've been working on:**

We completed our first round of research, conducting a total of 8 one-on-one 60 min individual interviews. Among those who volunteered were service members from various roles and ranks across the Space Force, including members of leadership, long-term service members with many years of experience, as well as those who are brand new to the Space Force. Our research helped us understand the differences and similarities these users have in their needs, goals, behaviors, and pain points around their day-to-day work and interactions with current service portals. The synthesis of our research and subsequent team alignment exercises uncovered over 20 different problem statements by the team. Here are four highlights we wanted to share with you:

Guardians don’t feel they have easy or consistent access to a single source of truth to understand goings on with topics they named as highly important - promotions, assignments, uniform changes, among others - without having to visit multiple sources separately.
Guardians, especially new service members, are challenged in identifying the upcoming and on-time completion of ongoing military requirements (such as PT tests, vaccinations, dentist appointments, etc.), while also balancing their job and home life responsibilities. The multiple disparate systems they need to access and plethora of email to filter through to find notifications of upcoming requirements were named as additional pain points regarding staying on top of their responsibilities.
Guardians have a desire to be presented with the most important, accurate, and up to date information from trusted sources that are personally relevant for them given their rank, role, and career goals. The ease by which they are able to access this information was highly sought after as well, naming current frustrations with searching through outdated articles, filtering through email, stale search results, or clicking into broken website links on current service portals.
Guardians have a need for consistent, reliable access to other critical services in order to fulfill their job function and military requirements in a timely manner. This desire for the portal to serve as a doorway to other services should mean, in their minds, that it should not be barred from access from any reasonable location, non-military network connection, or a specific device (i.e. access on personal mobile phones).
On the engineering side of things, we’ve begun to explore and test out some existing platforms and solutions we may use to support the new service portal. We are placing an emphasis on assembling a system that is optimized to deliver essential content over low-bandwidth networks, accessible on a variety of devices, easily maintained by content administrators, all while meeting a high standard of security and compliance requirements.

**What's next:**

We’ll be conducting a second round of research with another set of participants to gain a deeper understanding through screen sharing of the usability challenges of current service portals such as the Air Force portal.

We’ll also be conducting an asynchronous card sort study using a tool called Optimal Workshop to understand how users prioritize their own needs, which were collected by the team from our first round of research. This will give us clarity on the new Space Force portal features, the problems those features address, and which features should be built first.

We’ll be laying out the initial system architecture, building out a basic interactive prototype and making sure it’s accessible for users in later testing phases, and discussing requirements and constraints for analytics tracking tools.

The full team will work together on Scenario Writing and Journey Mapping activities.

We will also be setting up a microsite for publishing these updates and other artifacts related to the service portal progress.

### Week of 5/10

**What we've been working on:**

The Truss/USSF portal team has kicked off the project with a research phase called Discovery & Framing. The team is currently in week 4 of this 3 month effort, our strategy focusing on conducting user interviews, a technical exploration of current systems, and other deep learning activities. Once we feel we’ve gained enough knowledge of current user needs, the priorities associated with those needs and the Space Force’s technical capabilities and limitations, we will move into generating solutions and testing those ideas with actual users. This will ensure that we’re validating our product decisions, and focusing effort on the things Space Professionals will find most compelling and useful.

Over the last two weeks we’ve also begun our initial round of research, conducting 6 out of the planned 10 interviews with volunteer service members. We intentionally selected service members from various roles and ranks across the Space Force and include those who are long-term career service members as well as those who are new to the Space Force. The results from this initial round of research will be shared in our next update after synthesis is complete.

We’ve started to explore potential tools and technologies to use for developing the portal and its supporting systems, such as analytics and content management platforms. As we take the next steps in what the portal can be, there are some underlying infrastructure upgrades and identity solutions that we have to understand. By talking about the needs and capabilities now, we can make sure the portal is able to stay current and flexible for years to come.

We’ve taken some time to look through the existing Space Force portal, as well as some of the other branches’ service portals to do some competitive analysis. Additionally, we’ve facilitated team norming and other kickoff exercises, including discussing possible risks and mitigations, user archetypes, goals/anti-goals, and creating a definition of success for this project.

**What's next:**

Conduct research interviews with content managers and creators
Finish the CAC and Cloud ONE account setup for everyone on the team
Create user journey maps to help shape the development plans
Evaluate current and future infrastructure to make sure the transition is seamless
Build constraints around an analytics platform that will be able to grow with the Space Force