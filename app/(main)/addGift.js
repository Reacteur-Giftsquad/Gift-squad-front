import { useLocalSearchParams } from "expo-router";
import AddGiftForm from "../../components/AddGiftForm";

export default function AddGift() {
  const { eventId, ownerId, mode } = useLocalSearchParams();
  return mode === "gift" ? (
    <AddGiftForm eventId={eventId} mode="gift" />
  ) : (
    <AddGiftForm eventId={eventId} ownerId={ownerId} mode="wish" />
  );
}
