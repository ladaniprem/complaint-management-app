import React, { useState } from "react"; 
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  PanResponder, 
  ScrollView 
} from "react-native"; 
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 
 
const { width: SCREEN_WIDTH } = Dimensions.get("window"); 
const CARD_WIDTH = SCREEN_WIDTH - 30; // Card width with margins 
 
const HomeScreen = () => { 
  const router = useRouter(); 
  const [activeIndex, setActiveIndex] = useState(0); 
 
  // Event cards data 
  const eventCards = [ 
    { 
      id: "1", 
      image: require("../../assets/images/EventCard3.jpg"), 
      title: "Defend-X Cyber Summit 2025", 
      date: "Sun, 23 Feb, 2025", 
    }, 
    { 
      id: "2", 
      image: require("../../assets/images/Eventcard1.png"), 
      title: "Laracon India 2025", 
      date: "Sat-Sun, 8-9 Mar, 2025", 
    }, 
    { 
      id: "3", 
      image: require("../../assets/images/EventCard2.jpg"), 
      title: "AniMania Expo Gandhinagar", 
      date: "Sat-Sun, 1-2 Feb, 2025", 
    }, 
  ]; 
 
  // Main complaint categories with icons 
  const services = [ 
    { 
      id: "public-services", 
      name: "Public Services", 
      icon: <MaterialIcons name="public" size={32} color="#FFFFFF" />, 
      color: "#4CAF50" 
    }, 
    { 
      id: "consumer", 
      name: "Consumer Issues", 
      icon: <MaterialCommunityIcons name="shopping" size={32} color="#FFFFFF" />, 
      color: "#2196F3" 
    }, 
    { 
      id: "government", 
      name: "Government", 
      icon: <MaterialIcons name="account-balance" size={32} color="#FFFFFF" />, 
      color: "#9C27B0" 
    }, 
    { 
      id: "workplace", 
      name: "Workplace", 
      icon: <MaterialIcons name="work" size={32} color="#FFFFFF" />, 
      color: "#FF5722" 
    }, 
 
    { 
      id: "healthcare", 
      name: "Healthcare", 
      icon: <MaterialCommunityIcons name="hospital-box" size={32} color="#FFFFFF" />, 
      color: "#E91E63" 
    }, 
    { 
      id: "housing", 
      name: "Housing & Property", 
      icon: <MaterialCommunityIcons name="home-city" size={32} color="#FFFFFF" />, 
      color: "#795548" 
    }, 
    { 
      id: "financial", 
      name: "Financial & Banking", 
      icon: <MaterialCommunityIcons name="bank" size={32} color="#FFFFFF" />, 
      color: "#607D8B" 
    }, 
    { 
      id: "education", 
      name: "Education", 
      icon: <MaterialCommunityIcons name="school" size={32} color="#FFFFFF" />, 
      color: "#FF9800" 
    }, 
    { 
      id: "cybercrime", 
      name: "Cybercrime", 
      icon: <MaterialCommunityIcons name="shield-lock" size={32} color="#FFFFFF" />, 
      color: "#F44336" 
    } 
  ]; 
 
  const getItemLayout = (data, index) => ({ 
    length: CARD_WIDTH, 
    offset: CARD_WIDTH * index, 
    index, 
  }); 
 
  // PanResponder for swipe handling 
  const panResponder = PanResponder.create({ 
    onStartShouldSetPanResponder: () => true, 
    onPanResponderRelease: (e, gestureState) => { 
      if (gestureState.dx > 50) { 
        setActiveIndex((prev) => Math.max(prev - 1, 0)); 
      } else if (gestureState.dx < -50) { 
        setActiveIndex((prev) => Math.min(prev + 1, eventCards.length - 1)); 
      } 
    }, 
  }); 
 
  const viewabilityConfig = { 
    itemVisiblePercentThreshold: 50 
  }; 
 
  const onViewableItemsChanged = React.useRef(({ viewableItems }) => { 
    if (viewableItems.length > 0) { 
      setActiveIndex(viewableItems[0].index); 
    } 
  }).current; 
 
  const handleServicePress = (serviceId) => { 
    router.push(`/complaints/${serviceId}`); 
  }; 
 
  return ( 
    <SafeAreaView style={styles.container}> 
      {/* Header Section */} 
      <View style={styles.header}> 
        <Text style={styles.appTitle}> 
          Samadhan<Text style={styles.subtitle}>Setu</Text> 
        </Text> 
      </View> 
 
      <ScrollView style={styles.scrollView}> 
        {/* Event Cards Section - Moved to top */} 
        <Text
style=
{styles.sectionTitle}>Recent Updates</Text> 
        <View style={styles.eventContainer}> 
          <FlatList 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false} 
            data={eventCards} 
            keyExtractor={(item) => item.id} 
            snapToInterval={CARD_WIDTH} 
            decelerationRate="fast" 
            getItemLayout={getItemLayout} 
            viewabilityConfig={viewabilityConfig} 
            onViewableItemsChanged={onViewableItemsChanged} 
            renderItem={({ item }) => ( 
              <View style={styles.eventCard}> 
                <Image source={item.image} style={styles.cardImage} /> 
                <View style={styles.eventTextContainer}> 
                  <Text style={styles.eventTitle}> 
                    {item.title} 
                  </Text> 
                  <Text style={styles.eventDate}> 
                    {item.date} 
                  </Text> 
                </View> 
              </View> 
            )} 
          /> 
 
          {/* Pagination Dots */} 
          <View style={styles.pagination}> 
            {eventCards.map((_, index) => ( 
              <View 
                key={index} 
                style={[ 
                  styles.dot, 
                  { 
                    backgroundColor: index === activeIndex ? "#FF6B00" : "#D9D9D9", 
                  }, 
                ]} 
              /> 
            ))} 
          </View> 
        </View> 
 
        {/* Service Categories */} 
        <Text style={styles.sectionTitle}>Complaint Categories</Text> 
        <View style={styles.servicesContainer}> 
          {services.map((service, index) => ( 
            <TouchableOpacity  
              key={index}  
              style={styles.circleContainer} 
              onPress={() => handleServicePress(service.id)} 
            > 
              <View style={[styles.circle, { backgroundColor: service.color }]}> 
                {service.icon} 
              </View> 
              <Text style={styles.serviceText}>{service.name}</Text> 
            </TouchableOpacity> 
          ))} 
        </View> 
      </ScrollView> 
    </SafeAreaView> 
  ); 
}; 
 
const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF", 
  }, 
  header: { 
    padding: 10, 
    backgroundColor: "#FFFFFF", 
    borderBottomWidth: 1, 
    borderBottomColor: "#EEEEEE", 
  }, 
  appTitle: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: "#1666a8", 
  }, 
  subtitle: { 
    fontSize: 24, 
    fontWeight: "300", 
    color: "#3a9874", 
  }, 
  scrollView: { 
    flex: 1, 
  }, 
  eventContainer: { 
    height: 260, 
    marginTop: 8, 
    marginBottom: 16, 
  }, 
  eventCard: { 
    width: CARD_WIDTH, 
    height: 240, 
    borderRadius: 16, 
    overflow: "hidden", 
    marginHorizontal: 15, 
  }, 
  cardImage: { 
    width: "100%", 
    height: "100%", 
    resizeMode: "cover", 
  }, 
  eventTextContainer: { 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    padding: 16, 
  }, 
  eventTitle: { 
    color: "#FFFFFF", 
    fontSize: 20, 
    fontWeight: "700", 
  }, 
  eventDate: { 
    color: "#FFFFFF", 
    fontWeight: "600", 
    fontSize: 16, 
    marginTop: 4, 
  }, 
  pagination: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginTop: 8, 
  }, 
  dot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    marginHorizontal: 4, 
  }, 
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "600", 
    color: "#333333", 
    marginHorizontal: 15, 
    marginTop: 16, 
    marginBottom: 12, 
  }, 
  servicesContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-evenly', 
    paddingHorizontal: 10, 
    marginTop: 8, 
  }, 
  circleContainer: { 
    width: '30%', 
    alignItems: 'center', 
    marginBottom: 24, 
    paddingHorizontal: 8, 
  }, 
  circle: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 2, 
    }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
  }, 
  serviceText: { 
    color: '#333', 
    fontSize: 13, 
    textAlign: 'center', 
    fontWeight: '500', 
    lineHeight: 18, 
    maxWidth: 120, 
  }, 
}); 
 
export default HomeScreen;