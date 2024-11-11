import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Alert, 
  Pressable, 
  Dimensions, 
  RefreshControl, 
  Platform, 
  StatusBar 
} from 'react-native';
import { 
  Text, 
  Searchbar, 
  Card, 
  Button, 
  IconButton, 
  ActivityIndicator, 
  Surface, 
  useTheme 
} from 'react-native-paper';
import { 
  useState, 
  useCallback, 
  useRef, 
  useEffect 
} from 'react';
import { Link } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import Animated, { 
  FadeInUp, 
  FadeOutDown,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate 
} from 'react-native-reanimated';
import { MotiView } from 'moti';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32; // 16px padding on each side
const HEADER_HEIGHT = Platform.OS === 'ios' ? 120 : 100;

const AnimatedCard = Animated.createAnimatedComponent(Card);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const specialOffers = [
  {
    id: 1,
    title: '50% OFF',
    description: 'On your first order',
    image: { uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' },
    backgroundColor: '#FFE1E1',
    code: 'FIRST50'
  },
  {
    id: 2,
    title: 'Free Delivery',
    description: 'On orders above $30',
    image: { uri: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg' },
    backgroundColor: '#E8F5E9',
    code: 'FREEDEL'
  }
];

const categories = [
  { id: 1, name: 'Pizza', icon: '🍕', color: '#FFE1E1' },
  { id: 2, name: 'Burger', icon: '🍔', color: '#E8F5E9' },
  { id: 3, name: 'Sushi', icon: '🍱', color: '#E3F2FD' },
  { id: 4, name: 'Salad', icon: '🥗', color: '#FFF3E0' },
  { id: 5, name: 'Pasta', icon: '🍝', color: '#FCE4EC' }
];

const restaurants = [
  {
    id: 1,
    name: "Star Burger House",
    cuisine: "Turkish",
    rating: 4.5,
    ratingCount: 458,
    distance: "1.2 km",
    image: require('../../assets/images/star-burger.jpg'),
    time: "20-30 min",
    priceRange: "$$$",
    featured: true,
    isOpen: true,
    category: 1,
    deliveryFee: "$2.50",
    minOrder: "$15"
  },
  {
    id: 2,
    name: "Sayram Chicken",
    cuisine: "Fast Food",
    rating: 4.2,
    ratingCount: 356,
    distance: "0.8 km",
    image: require('../../assets/images/sayram-chicken.jpg'),
    time: "15-25 min",
    priceRange: "$$",
    featured: false,
    isOpen: true,
    category: 2,
    deliveryFee: "$1.50",
    minOrder: "$10"
  },
  {
    id: 3,
    name: 'Abdunur Sushi Master',
    rating: '4.8',
    ratingCount: '2.1k',
    time: '25-35 min',
    category: 3,
    image: { uri: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500' },
    cuisine: 'Japanese',
    priceRange: '$$$',
    isOpen: true,
    distance: '2.1 km',
    deliveryFee: '700 ₸',
    minOrder: '4000 ₸',
    featured: false
  },
  {
    id: 4,
    name: 'Green Bowl',
    rating: '4.6',
    ratingCount: '856',
    time: '15-25 min',
    category: 4,
    image: { uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500' },
    cuisine: 'Healthy',
    priceRange: '$$',
    isOpen: true,
    distance: '1.5 km',
    deliveryFee: '600 ₸',
    minOrder: '2500 ₸',
    featured: false
  },
  {
    id: 5,
    name: 'Wok & Roll',
    rating: '4.4',
    ratingCount: '654',
    time: '25-35 min',
    category: 5,
    image: { uri: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500' },
    cuisine: 'Asian',
    priceRange: '$$',
    isOpen: true,
    distance: '2.8 km',
    deliveryFee: '800 ₸',
    minOrder: '3000 ₸',
    featured: false
  },
  {
    id: 6,
    name: 'Sweet Dreams',
    rating: '4.9',
    ratingCount: '2.3k',
    time: '15-25 min',
    category: 6,
    image: { uri: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500' },
    cuisine: 'Desserts',
    priceRange: '$',
    isOpen: true,
    distance: '1.7 km',
    deliveryFee: '500 ₸',
    minOrder: '2000 ₸',
    featured: false
  },
  {
    id: 7,
    name: 'Pasta Palace',
    rating: '4.8',
    ratingCount: '1.8k',
    time: '25-35 min',
    category: 7,
    image: { uri: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500' },
    cuisine: 'Italian',
    priceRange: '$$$',
    isOpen: true,
    distance: '3.2 km',
    deliveryFee: '900 ₸',
    minOrder: '4500 ₸',
    featured: false
  },
  {
    id: 8,
    name: 'Juice & Coffee Bar',
    rating: '4.6',
    ratingCount: '932',
    time: '10-15 min',
    category: 8,
    image: { uri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500' },
    cuisine: 'Beverages',
    priceRange: '$',
    isOpen: true,
    distance: '0.5 km',
    deliveryFee: '400 ₸',
    minOrder: '1500 ₸',
    featured: false
  }
];
export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollY = useSharedValue(0);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Header animation
  const headerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT],
      { extrapolateRight: Extrapolate.CLAMP }
    );
    return {
      transform: [{ translateY }],
    };
  });

  // Search handler
  const handleSearch = useCallback((query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    
    setTimeout(() => {
      const filtered = restaurants.filter(restaurant => {
        const searchTerms = [
          restaurant.name,
          restaurant.cuisine,
          restaurant.priceRange
        ].map(term => term.toLowerCase());
        
        return searchTerms.some(term => 
          term.includes(query.toLowerCase())
        );
      });
      
      setFilteredRestaurants(filtered);
      setIsSearching(false);
    }, 500);
  }, []);

  // Category selection handler
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    if (categoryId === selectedCategory) {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(restaurant => 
        restaurant.category === categoryId
      );
      setFilteredRestaurants(filtered);
    }
  };

  // Offer press handler
  const handleOfferPress = async (offer) => {
    if (offer.code) {
      try {
        await Clipboard.setStringAsync(offer.code);
        Alert.alert(
          "Success!",
          `Promo code ${offer.code} copied to clipboard!`,
          [{ text: "OK" }]
        );
      } catch (err) {
        Alert.alert("Error", "Could not copy code to clipboard");
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B3A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.header, headerStyle]}>
        <View style={styles.headerBlur}>
          <View style={styles.addressBar}>
            <IconButton icon="map-marker" size={24} iconColor="#fff" />
            <View>
              <Text style={styles.deliverTo}>DELIVER TO</Text>
              <Text style={styles.address}>Home • 123 Main Street</Text>
            </View>
            <IconButton icon="chevron-down" size={24} iconColor="#fff" />
          </View>

          <Text style={styles.title}>Food Delivery</Text>
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search restaurants, cuisines..."
              onChangeText={handleSearch}
              value={searchQuery}
              style={styles.searchBar}
              icon="magnify"
              clearIcon="close"
              onClearIconPress={() => {
                setSearchQuery('');
                setFilteredRestaurants(restaurants);
              }}
            />
            {isSearching && (
              <ActivityIndicator 
                size={20} 
                color="#FF4B3A" 
                style={styles.searchLoader} 
              />
            )}
          </View>
        </View>
      </Animated.View>

      <AnimatedScrollView
        style={styles.content}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#FF4B3A"
          />
        }
      >
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.offersContainer}
          >
            {specialOffers.map((offer, index) => (
              <Animated.View
                key={offer.id}
                entering={FadeInUp.delay(index * 100)}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.offerPressable,
                    pressed && styles.pressed
                  ]}
                  onPress={() => handleOfferPress(offer)}
                >
                  <Surface style={[styles.offerCard, { backgroundColor: offer.backgroundColor }]}>
                    <Image source={offer.image} style={styles.offerImage} />
                    <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                      <View style={styles.offerContent}>
                        <Text style={styles.offerTitle}>{offer.title}</Text>
                        <Text style={styles.offerDescription}>{offer.description}</Text>
                      </View>
                    </View>
                  </Surface>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
        >
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesContainer}
          >
            {categories.map((category, index) => (
              <Animated.View
                key={category.id}
                entering={FadeInUp.delay(index * 50)}
              >
                <Pressable
                  onPress={() => handleCategorySelect(category.id)}
                  style={({ pressed }) => [
                    styles.categoryButton,
                    { backgroundColor: category.color },
                    pressed && styles.categoryPressed,
                    selectedCategory === category.id && styles.selectedCategory
                  ]}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 400 }}
        >
          <Text style={styles.sectionTitle}>Popular Restaurants</Text>
          {filteredRestaurants.map((restaurant, index) => (
            <Animated.View
              key={restaurant.id}
              entering={FadeInUp.delay(index * 100)}
            >
              <Link href={`/restaurant/${restaurant.id}`} asChild>
                <Pressable
                  style={({ pressed }) => [
                    styles.restaurantPressable,
                    pressed && styles.pressed
                  ]}
                >
                  <Surface style={styles.restaurantCard}>
                    <View style={styles.imageContainer}>
                      <Image 
                        source={restaurant.image} 
                        style={styles.restaurantCover}
                        resizeMode="cover"
                      />
                      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
                      {restaurant.featured && (
                        <View style={styles.featuredBadge}>
                          <Text style={styles.featuredText}>Featured</Text>
                        </View>
                      )}
                      <View style={styles.restaurantBadge}>
                        <Text style={styles.badgeText}>
                          {restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}
                        </Text>
                      </View>
                      <View style={styles.distanceBadge}>
                        <Text style={styles.distanceText}>{restaurant.distance}</Text>
                      </View>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.restaurantName}>{restaurant.name}</Text>
                      <View style={styles.restaurantInfo}>
                        <View style={styles.ratingContainer}>
                          <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
                          <Text style={styles.ratingCount}>({restaurant.ratingCount})</Text>
                        </View>
                        <Text style={styles.time}>{restaurant.time}</Text>
                      </View>
                      <View style={styles.restaurantInfo}>
                        <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
                        <Text style={styles.priceText}>{restaurant.priceRange}</Text>
                      </View>
                      <View style={styles.deliveryInfo}>
                        <Text style={styles.deliveryText}>
                          🛵 {restaurant.deliveryFee} • Min. {restaurant.minOrder}
                        </Text>
                      </View>
                    </View>
                  </Surface>
                </Pressable>
              </Link>
            </Animated.View>
          ))}
        </MotiView>
      </AnimatedScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: HEADER_HEIGHT + 70,
  },
  headerBlur: {
    backgroundColor: '#FF4B3A',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginBottom: 16,
    padding: 8,
  },
  deliverTo: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  address: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: -24,
  },
  searchBar: {
    elevation: 4,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  searchLoader: {
    position: 'absolute',
    right: 48,
    top: 12,
  },
  content: {
    flex: 1,
    paddingTop: HEADER_HEIGHT + 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  offersContainer: {
    paddingLeft: 16,
  },
  offerPressable: {
    marginRight: 16,
  },
  offerCard: {
    width: 280,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
  offerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  offerContent: {
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  categoriesContainer: {
    paddingLeft: 16,
    marginBottom: 24,
  },
  categoryButton: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  selectedCategory: {
    borderWidth: 3,
    borderColor: '#FF4B3A',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  restaurantPressable: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  restaurantCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  restaurantCover: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FF4B3A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featuredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  restaurantBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  distanceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  restaurantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  ratingCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  cuisineText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  priceText: {
    fontSize: 14,
    color: '#FF4B3A',
    fontWeight: 'bold',
  },
  deliveryInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  deliveryText: {
    fontSize: 14,
    color: '#666',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});