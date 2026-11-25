const { faker } = require('@faker-js/faker')

const userSize = 10
const eventSize = 10
const postsSize = 15
const listSize = 5

const demoProfiles = [
  {
    username: 'Emma Wilson',
    bio: 'Web3 enthusiast, event organizer and digital art collector.',
    address: 'San Francisco, CA'
  },
  {
    username: 'Alex Morgan',
    bio: 'Blockchain developer building decentralized applications.',
    address: 'Austin, TX'
  },
  {
    username: 'Sofia Chen',
    bio: 'Digital artist exploring NFTs and creative technology.',
    address: 'New York, NY'
  },
  {
    username: 'Daniel Park',
    bio: 'Software engineer and crypto enthusiast.',
    address: 'Seattle, WA'
  },
  {
    username: 'Mia Rodriguez',
    bio: 'Community builder and Web3 advocate.',
    address: 'Miami, FL'
  },
  {
    username: 'James Taylor',
    bio: 'Technology entrepreneur and NFT collector.',
    address: 'Los Angeles, CA'
  },
  {
    username: 'Olivia Martin',
    bio: 'UX designer passionate about decentralized technology.',
    address: 'Boston, MA'
  },
  {
    username: 'Lucas Brown',
    bio: 'Ethereum developer and open-source contributor.',
    address: 'Denver, CO'
  },
  {
    username: 'Isabella Lee',
    bio: 'Creative technologist and digital storyteller.',
    address: 'Chicago, IL'
  },
  {
    username: 'Noah Garcia',
    bio: 'Exploring blockchain and digital communities.',
    address: 'San Diego, CA'
  },
  {
    username: 'Ava Thompson',
    bio: 'Product designer and digital art enthusiast.',
    address: 'Portland, OR'
  },
  {
    username: 'Ethan Davis',
    bio: 'Building the next generation of Web3 experiences.',
    address: 'Dallas, TX'
  }
]

const demoCoordinates = [
  { lat: 37.7749, long: -122.4194 },
  { lat: 30.2672, long: -97.7431 },
  { lat: 40.7128, long: -74.0060 },
  { lat: 47.6062, long: -122.3321 },
  { lat: 25.7617, long: -80.1918 },
  { lat: 34.0522, long: -118.2437 },
  { lat: 42.3601, long: -71.0589 },
  { lat: 39.7392, long: -104.9903 },
  { lat: 41.8781, long: -87.6298 },
  { lat: 32.7157, long: -117.1611 },
  { lat: 45.5152, long: -122.6784 },
  { lat: 32.7767, long: -96.7970 }
]

module.exports = class DataSeeder {
  constructor(firebaseApp) {
    this.app = firebaseApp
    this.db = this.app.firestore()
    this.auth = this.app.auth()
    /**add here an array of dummy users for local use. */
    this.dummyUsers = new Array(12)
  }
  user1UID = ' '
  user2UID = ' '

  /**
   * function: setDummyAuthUser
   * --description: it creates a user in the firebase auth, this.auth, for logging in the front end;
   *    and sets their uid document in firestore, this.db, for accessing their data.
   *    if the user already exists in the auth database, then its skipped.
   */
async setDummyAuthUser(email, phoneNumber, password, avatarIndex) {
    var strippedUID = ' '
    var isUserCreated = true
    try {
      //check if a dummy user has been created with this email,
      //if it does return right away its uid
      var userData = await this.auth.getUserByEmail(email).catch((error) => {
        isUserCreated = false
      })
      if (isUserCreated) {
        return userData.uid
      }
      var docSnap = await this.auth
        .createUser({
          emailVerified: true,
          email: email,
          phoneNumber: phoneNumber,
          password: password,
          disabled: false
        })
        .catch((error) => {
          console.log(error, 'setDummyAuthUserError: ' + phoneNumber)
        })
      if (docSnap) {
        strippedUID = `${docSnap.uid}`
        await this.db
          .collection('users')
          .doc(`${docSnap.uid}`)
          .set({
            avatar: `/demo/avatars/avatar-${String(avatarIndex).padStart(2, '0')}.jpg`,
            bio: demoProfiles[avatarIndex - 1].bio,
            discord_guilds: [],
            discord_id: '',
            discord_verified: false,
            email: faker.internet.email(),
         location: {
  address: demoProfiles[avatarIndex - 1].address,
  ...demoCoordinates[avatarIndex - 1]
},
            organizations: [],
            phone_number: phoneNumber,
            qr_code: '',
            siwe_expiration_time: '',
            twitter_id: '',
            twitter_verified: false,
            tw_verifs: [],
            twitter_name: [],
            username: demoProfiles[avatarIndex - 1].username,
            wallet: '',
            email_verified: false
          })
      }
    } catch (error) {
      console.log(error, 'auth seed failed')
    }
    return strippedUID
  }

  /**
   * function: setDummyUsersInDB
   * --description: it creates an array of generated dummy users, with data randomly generated for each dummy user.
   * Each generated dummy user is added right away to the 'users' collection firestore,
   * this.db, setting the generated data to their respective fileds.
   */
  async setDummyUsersInDB() {
    try {
  ;[...Array(userSize).keys()].map((index) => {
        const dummyUserData = {
          avatar: `/demo/avatars/avatar-${String(index + 3).padStart(2, '0')}.jpg`,
         bio: demoProfiles[index + 2].bio,
          discord_guilds: [],
          discord_id: '',
          discord_verified: false,
          email: faker.internet.email(),
location: {
  address: demoProfiles[index + 2].address,
  ...demoCoordinates[index + 2]
},
          organizations: [],
          phone_number: faker.phone.number('+###-###-#####'),
          qr_code: '',
          siwe_expiration_time: '',
          twitter_id: '',
          twitter_verified: false,
          tw_verifs: [],
          twitter_name: [],
          username: demoProfiles[index + 2].username,
          wallet: '',
          email_verified: false
        }
        this.db.collection('users').add(dummyUserData)
      })
      console.log('setDummyUsersInDB: seed was successful')
    } catch (error) {
      console.error(error, 'database seed failed')
    }
  }

  /**
   * function: setDummyEventsCollectionInDB
   * --description: it creates an array of generated events, with data randomly generated for each dummy event.
   * it creates an array of generated dummy users, with data randomly generated for each dummy user.
   * Each generated dummy user is added right away to the 'users' collection firestore,
   * this.db, setting the generated data to their respective fileds.
   * Also, each event sets the user id, uid, from the already authenticated users.
   */

async setDummyEventsCollectionInDB() {
  const events = [
    {
      title: 'Web3 Builders Summit',
      description: 'Connect with developers and innovators building the future of decentralized technology.'
    },
    {
      title: 'Digital Art Experience',
      description: 'Explore immersive digital artwork and meet talented artists from around the world.'
    },
    {
      title: 'NFT Creators Meetup',
      description: 'Meet NFT creators, collectors and digital art enthusiasts.'
    },
    {
      title: 'Future of Blockchain',
      description: 'Discover emerging blockchain technologies through talks and interactive workshops.'
    },
    {
      title: 'Crypto & Coffee',
      description: 'Enjoy coffee and casual conversations with the local crypto community.'
    },
    {
      title: 'Metaverse Festival',
      description: 'Experience virtual worlds, immersive entertainment and digital culture.'
    },
    {
      title: 'Women in Web3',
      description: 'Celebrate and connect with women shaping the decentralized technology industry.'
    },
    {
      title: 'Ethereum Hackathon',
      description: 'Collaborate with developers to build innovative decentralized applications.'
    },
    {
      title: 'Digital Collectors Night',
      description: 'Discover unique digital collectibles and connect with fellow collectors.'
    },
    {
      title: 'Decentralized Futures',
      description: 'Explore the future of decentralized communities, technology and innovation.'
    }
  ]
const eventLocations = [
  { address: 'San Francisco, CA', lat: 37.7749, long: -122.4194 },
  { address: 'New York, NY', lat: 40.7128, long: -74.0060 },
  { address: 'Miami, FL', lat: 25.7617, long: -80.1918 },
  { address: 'Austin, TX', lat: 30.2672, long: -97.7431 },
  { address: 'Seattle, WA', lat: 47.6062, long: -122.3321 },
  { address: 'Los Angeles, CA', lat: 34.0522, long: -118.2437 },
  { address: 'Boston, MA', lat: 42.3601, long: -71.0589 },
  { address: 'Denver, CO', lat: 39.7392, long: -104.9903 },
  { address: 'Chicago, IL', lat: 41.8781, long: -87.6298 },
  { address: 'San Diego, CA', lat: 32.7157, long: -117.1611 }
]

  try {
    for (const [index, event] of events.entries()) {
      const imageNumber = String(index + 1).padStart(2, '0')

      const startDate = new Date()
      startDate.setDate(startDate.getDate() + (index + 1) * 7)

      const endDate = new Date(startDate)
      endDate.setHours(endDate.getHours() + 4)

      const eventId = event.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .trim()
        .replace(/\s+/g, '-')

      await this.db.collection('events').doc(eventId).set({
        description: event.description,
        end_date: endDate,
        start_date: startDate,
        img_url: `/demo/events/event-${imageNumber}.jpg`,
        landing_portrait_url: `/demo/banners/banner-${imageNumber}.jpg`,
        title: event.title,
        uid: index % 2 === 0 ? this.user1UID : this.user2UID,
        ticket_max: 50 + index * 10,
        event_id: eventId,
        registered_attendees: 0,
  location: eventLocations[index]
      })
    }

    console.log('Events seeded successfully')
  } catch (error) {
    console.error(error, 'Event seed failed')
  }
}


  /**
   * function: setDummyEventsToUserPropietaryDB
   * --description: it adds the event reference(eventRef), along other data, to the user document; who created the event.
   *   This data is added to the 'upcoming_events' collection, inside the uid doc.
   */
  async setDummyEventsToUserPropietaryDB() {
    const eventsRef = this.db.collection('events')
    var eventsDocs = await eventsRef.get()
    eventsDocs.forEach((doc) => {
      var docData = doc.data()
      if (docData['uid'] === this.user1UID) {
        this.db
          .collection(`users/${docData['uid']}/upcoming_events`)
          .doc(`${doc.id}`)
          .set({
            end_date: docData['end_date'],
            event_ref: this.db.doc(`events/${doc.id}`),
            event_title: docData['title'],
            start_date: docData['start_date']
          })
      } else if (docData['uid'] === this.user2UID) {
        this.db
          .collection(`users/${docData['uid']}/upcoming_events`)
          .doc(`${doc.id}`)
          .set({
            end_date: docData['end_date'],
            event_ref: this.db.doc(`events/${doc.id}`),
            event_title: docData['title'],
            start_date: docData['start_date']
          })
      }
    })
  }

  /**
   * Description:
   * it adds some users to the events as registered attendees.
   * These users will be added to  registered_attendees collection
   */
  async setRegisteredAttendeesToEvents() {
    try {
      const eventsRef = this.db.collection('events')
      const usersRef = this.db.collection('users')
      const eventsDocs = await eventsRef.get()
      const usersDocs = await usersRef.get()
      usersDocs.forEach((user) => {
        //for each user, register them to an event as an attendee.
        if (user.id !== this.user1UID && user.id !== this.user2UID) {
          eventsDocs.forEach((event) => {
            const registeredAttendeesRef = this.db.collection(
              `events/${event.id}/registered_attendees`
            )
            eventsRef
              .doc(`${event.id}`)
              .update({ registered_attendees: userSize })
            registeredAttendeesRef.doc(user.id).set({
              address: faker.address.streetAddress(),
              city: faker.address.city(),
              username: user.data().username,
              avatar: user.data().avatar,
              phone_number: '',
              state: faker.address.state(),
              uid: user.id,
              zip_code: faker.address.zipCode('#####'),
              date_of_registration: new Date()
            })
          })
        }
      })
    } catch (e) {
      console.error(
        e,
        'dataSeeder::setRegisteredAttendeesToEvents Error Caught'
      )
    }
  }

  async setRegisteredEventsToUsers() {
    try {
      const eventsRef = this.db.collection('events')
      const usersRef = this.db.collection('users')
      const eventsDocs = await eventsRef.get()
      const usersDocs = await usersRef.get()

      usersDocs.forEach((user) => {
        if (user.id !== this.user1UID && user.id !== this.user2UID) {
          eventsDocs.forEach((event) => {
            const registeredEventsRef = this.db.collection(
              `users/${user.id}/registered_events`
            )
            registeredEventsRef.doc(event.data().event_id).set({
              event_ref: this.db
                .collection('events')
                .doc(event.data().event_id),
              event_title: event.data().title,
              start_date: event.data().start_date,
              end_date: event.data().end_date
            })
          })
        }
      })
    } catch (e) {
      console.error(e, 'dataSeeder::setRegisteredEventsToUsers Error Caught')
    }
  }

  /**
   * Function: setSocialFeedDummyData
   * --description: it creates a collection of posts for each event doc.
   * each post document has an author(uid, user_name, avatar), date of creation, comment;  eid,
   * specifying where the post belongs to.
   */
  async setSocialFeedDummyData() {
    try {
      const eventsRef = this.db.collection('events')
      const usersRef = this.db.collection('users')
      const usersDocs = await usersRef.get()
      const eventsDocs = await eventsRef.get()
      const localUserDocs = []
      usersDocs.forEach((user) => {
        localUserDocs.push(user)
      })
      eventsDocs.forEach((event) => {
        ;[...Array(postsSize).keys()].map((index) => {
          let randomIndex = Math.floor(Math.random() * 100) % userSize
          let user = localUserDocs[randomIndex]
          eventsRef
            .doc(`${event.id}`)
            .collection('posts')
            .doc()
            .set({
              uid: user.id,
              username: user.data().username,
              avatar: user.data().avatar,
              post_content: faker.lorem.lines(3),
              date_posted: new Date()
            })
        })
      })
    } catch (e) {
      console.error(e, 'dataSeeder::setSocialFeedDummyData error caught')
    }
  }

  /**
   * function: setDummyAllowlistData
   * --description: it creates an array of generated allowlists, with data randomnly generated for each list.
   * Each generated dummy list is added right away to the 'lists' collection firestore,
   * this.db setting the generated data to their respective fields.
   */
  async setDummyAllowlistData() {
    try {
      ;[...Array(listSize).keys()].map(async () => {
        const dummyAllowlistData = {
          allowlist: faker.finance.ethereumAddress(),
          description: faker.commerce.productDescription(),
          discordGuild: faker.datatype.boolean(),
          discordGuildId: '605866305094156333',
          discordVerif: faker.datatype.boolean(),
          emailVerif: faker.datatype.boolean(),
          permalink: 'https://discord.gg/U4Qzdbz',
          title: faker.datatype.string(),
          twitterAccountId: '783214',
          twitterFollowing: faker.datatype.boolean(),
          twitterVerif: faker.datatype.boolean(),
          uid: await this.db.collection('users').doc(this.user1UID),
          walletVerif: faker.datatype.boolean()
        }
        this.db.collection('lists').add(dummyAllowlistData)
      })
      console.log('setAllowlistInDB: seed was successful')
    } catch (error) {
      console.error(error, 'database seed failed')
    }
  }

  /**
   * function: initDummyData
   * description: this function runs the functions, that seeds the generated dummy
   * data to firebase emulators.
   */
  async initDummyData() {
this.user1UID = await this.setDummyAuthUser(
  'test123@gmail.com',
  '+13233546886',
  '1234567890',
  1
)

this.user2UID = await this.setDummyAuthUser(
  'test321@gmail.com',
  '+10002223333',
  '0987654321',
  2
)
    await this.setDummyEventsCollectionInDB()
    await this.setDummyEventsToUserPropietaryDB()
    await this.setDummyUsersInDB()
    await this.setRegisteredAttendeesToEvents()
    await this.setRegisteredEventsToUsers()
    await this.setSocialFeedDummyData()
    await this.setDummyAllowlistData()
  }
}
