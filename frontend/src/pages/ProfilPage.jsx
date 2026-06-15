import { useParams } from "react-router-dom";
import OwnProfile from "../components/profile/OwnProfile";
import OtherProfile from "../components/profile/OtherProfile";

export default function ProfilPage() {
  const { id } = useParams();
  const loggedInUserId = JSON.parse(localStorage.getItem("user") || "null")?.id;
  const profileId = id ? parseInt(id) : null;
  const isOwn = !profileId || profileId === loggedInUserId;

  if (isOwn) return <OwnProfile />;
  return <OtherProfile profileId={profileId} loggedInUserId={loggedInUserId} />;
}
