// Generate random posts for the feed
export function generatePosts(count: number, isConnected = false) {
  const posts = [];
  const positions = [
    "Forward",
    "Midfielder",
    "Defender",
    "Goalkeeper",
    "Coach",
    "Analyst",
  ];
  const teams = [
    "FC Barcelona",
    "Manchester United",
    "Real Madrid",
    "Bayern Munich",
    "PSG",
    "Liverpool",
    "Chelsea",
  ];
  const timeAgo = [
    "Just now",
    "5m ago",
    "10m ago",
    "30m ago",
    "1h ago",
    "2h ago",
    "5h ago",
    "Yesterday",
  ];

  const images = [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=500&width=600",
    "/placeholder.svg?height=600&width=600",
  ];

  const postContents = [
    "Just finished an amazing training session with the team! 💪 #FootballLife",
    "Great win today! The team showed incredible spirit and determination. Proud of everyone! ⚽️🏆",
    "Analyzing our last match. We need to improve our defensive positioning, but our attack is looking sharp! 📊",
    "Excited to announce I've signed with a new club! More details coming soon... 🖋️",
    "Recovery day. Ice baths and physio sessions are not fun but necessary! 🧊",
    "Looking for recommendations on the best football boots for artificial turf. Any suggestions? 👟",
    "Watching the Champions League final. What a game! Who are you supporting? 📺",
    "Just released my new training program for young footballers. Check the link in my profile! 🔗",
    "Throwback to my first professional match. Time flies! ⏳",
    "Working on my free kicks today. Practice makes perfect! 🎯",
  ];

  for (let i = 0; i < count; i++) {
    const hasImage = Math.random() > 0.5;
    const commentsCount = Math.floor(Math.random() * 5);
    const comments = [];

    for (let j = 0; j < commentsCount; j++) {
      comments.push({
        id: `comment-${i}-${j}`,
        user: {
          id: `user-${Math.floor(Math.random() * 1000)}`,
          name: `User ${Math.floor(Math.random() * 100)}`,
          username: `user${Math.floor(Math.random() * 100)}`,
          avatar: "/placeholder.svg",
        },
        content: `This is a comment ${j + 1} on post ${i + 1}. Great post!`,
        timestamp: timeAgo[Math.floor(Math.random() * timeAgo.length)],
      });
    }

    posts.push({
      id: `post-${Date.now()}-${i}`,
      user: {
        id: `user-${i}`,
        name: `Player ${i + 1}`,
        username: `player${i + 1}`,
        avatar: "/placeholder.svg",
        position: positions[Math.floor(Math.random() * positions.length)],
        team: teams[Math.floor(Math.random() * teams.length)],
        isConnected: isConnected || Math.random() > 0.7,
      },
      content: postContents[Math.floor(Math.random() * postContents.length)],
      image: hasImage
        ? images[Math.floor(Math.random() * images.length)]
        : undefined,
      likes: Math.floor(Math.random() * 100),
      comments,
      timestamp: timeAgo[Math.floor(Math.random() * timeAgo.length)],
      hasLiked: Math.random() > 0.7,
    });
  }

  return posts;
}

// Generate random connections
export function generateConnections(count: number) {
  const connections = [];
  const roles = ["Player", "Coach", "Scout", "Club", "Agent"];
  const teams = [
    "FC Barcelona",
    "Manchester United",
    "Real Madrid",
    "Bayern Munich",
    "PSG",
    "Liverpool",
    "Chelsea",
  ];

  for (let i = 0; i < count; i++) {
    connections.push({
      id: `connection-${i}`,
      name: `Connection ${i + 1}`,
      username: `connection${i + 1}`,
      avatar: "/placeholder.svg",
      role: roles[Math.floor(Math.random() * roles.length)],
      team:
        Math.random() > 0.2
          ? teams[Math.floor(Math.random() * teams.length)]
          : null,
      mutualConnections: Math.floor(Math.random() * 20),
    });
  }

  return connections;
}

// Generate random requests
export function generateRequests(count: number) {
  const roles = ["Player", "Coach", "Scout", "Club", "Agent"];
  const teams = [
    "FC Barcelona",
    "Manchester United",
    "Real Madrid",
    "Bayern Munich",
    "PSG",
    "Liverpool",
    "Chelsea",
  ];
  const timeAgo = [
    "Just now",
    "5m ago",
    "10m ago",
    "30m ago",
    "1h ago",
    "2h ago",
    "5h ago",
    "Yesterday",
  ];

  const incoming = [];
  const outgoing = [];

  // Generate incoming requests
  const incomingCount = Math.floor(count / 2);
  for (let i = 0; i < incomingCount; i++) {
    incoming.push({
      id: `incoming-${i}`,
      name: `Incoming ${i + 1}`,
      username: `incoming${i + 1}`,
      avatar: "/placeholder.svg",
      role: roles[Math.floor(Math.random() * roles.length)],
      team:
        Math.random() > 0.2
          ? teams[Math.floor(Math.random() * teams.length)]
          : null,
      mutualConnections: Math.floor(Math.random() * 20),
    });
  }

  // Generate outgoing requests
  const outgoingCount = count - incomingCount;
  for (let i = 0; i < outgoingCount; i++) {
    outgoing.push({
      id: `outgoing-${i}`,
      name: `Outgoing ${i + 1}`,
      username: `outgoing${i + 1}`,
      avatar: "/placeholder.svg",
      role: roles[Math.floor(Math.random() * roles.length)],
      team:
        Math.random() > 0.2
          ? teams[Math.floor(Math.random() * teams.length)]
          : null,
      sentTime: timeAgo[Math.floor(Math.random() * timeAgo.length)],
    });
  }

  return { incoming, outgoing };
}
