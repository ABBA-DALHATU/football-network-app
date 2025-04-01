import { useEffect } from "react";
import { useRouter } from "next/router";

const UserPage = () => {
  const router = useRouter();
  const { userId } = router.query; // Get the userId from the URL

  useEffect(() => {
    if (userId) {
      // Redirect to the feed page when userId is available
      router.push(`/user/${userId}/feed`);
    }
  }, [userId, router]);

  return null; // You can return a loading spinner or message if needed
};

export default UserPage;
