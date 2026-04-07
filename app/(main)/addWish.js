import { useLocalSearchParams } from "expo-router";
import AddGiftForm from "../../components/AddGiftForm";

export default function AddWish() {
  const { eventId, ownerId } = useLocalSearchParams();

  return <AddGiftForm eventId={eventId} ownerId={ownerId} mode="wish" />;
}
