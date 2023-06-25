import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Card, Chip, Text } from "react-native-paper";

const TrainCard = ({ train }) => {
  const [selectedClassIndex, setSelectedClassIndex] = useState(-1);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const showTrainInfo = async () => {
    if (selectedClassIndex === -1) {
      setTickets([]);
      return;
    }
    setLoading(true);
    const response = await fetch(
      `https://us-central1-mind-pen-22c05.cloudfunctions.net/getAlternatives?train_no=${train.train_no}&src=${train.from_station_code}&des=${train.to_station_code}&date=${train.date}&travel_class=${train.classes[selectedClassIndex]}&quota=${train.quota}`
    );
    const data = await response.json();
    setTickets(data);
    setLoading(false);
  };
  useEffect(() => {
    showTrainInfo();
  }, [selectedClassIndex]);
  return (
    <Card className="my-2 relative">
      <Card.Title
        titleVariant="titleLarge"
        title={train.train_name}
        subtitle={
          train.train_no +
          " (" +
          train.from_station_code +
          " - " +
          train.to_station_code +
          ")"
        }
      />
      <View className="absolute right-4 h-24 justify-center flex items-end gap-2 text-right">
        <Chip icon="clock" compact mode="outlined" className="w-32">
          {train.departure_time} - {train.arrival_time}
        </Chip>
        <Text>{train.duration}</Text>
      </View>
      <View className="flex flex-row p-2 gap-2">
        {train.classes.map((trainClass, index) => (
          <Chip
            key={trainClass}
            icon="seat"
            mode={index === selectedClassIndex ? "contained" : "outlined"}
            onPress={() =>
              setSelectedClassIndex(index === selectedClassIndex ? -1 : index)
            }
            compact
          >
            {trainClass}
          </Chip>
        ))}
      </View>
      {selectedClassIndex !== -1 && (
        <ScrollView
          className={`${loading ? "h-16" : "h-48"} overflow-y-auto flex`}
          nestedScrollEnabled={true}
        >
          {loading ? (
            <ActivityIndicator className="mt-4"/>
          ) : (
            tickets.map((ticket, index) => (
              <View
                key={index}
                className="flex flex-row p-2 px-4 border w-full justify-between items-center"
              >
                <Chip mode="outlined" className="w-24" compact>
                  {ticket.src}-{ticket.des}
                </Chip>
                <Text className={String(ticket.availability).includes('AVL')?`text-green-400`:`text-red-400`}>{ticket.availability}</Text>
                <Text variant="headlineMedium">₹ {ticket.fare}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </Card>
  );
};

export default TrainCard;
