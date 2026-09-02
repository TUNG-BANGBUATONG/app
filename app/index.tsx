import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Dimensions helper for layout
const { width } = Dimensions.get('window');

// Mock Product Interface
interface Product {
  id: string;
  name: string;
  grade: 'PG' | 'MG' | 'RG' | 'HG' | 'SD';
  scale: string;
  price: number;
  image_url: string;
  badge_status: 'Active' | 'Out of stock';
  color: string;
  description: string;
  rating: number;
  reviews: number;
}

// Initial Mock Data (Gunpla Kits)
/*
// Initial Mock Data (Gunpla Kits)
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'TURN A GUNDAM MG',
    grade: 'MG',
    scale: '1/60',
    price: 180.00,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwqF5wCKg-m8EXDx6tCAfnzCbg4qXIFG_dIgAVaPLXggCnO4mLrNZ4nI0&s=10',
    isActive: true,
    color: '#DC2626', // Brand Red (Theme match)
    description: 'The ultimate evolution of RX-78-2 Gundam featuring multi-layer inner frames, extensive metal parts, and a comprehensive LED system. Truly the pinnacle of Gunpla design.',
    rating: 5.0,
    reviews: 8712,
  },
  {
    id: '2',
    name: 'TURN A INGRESSAGUNDAM MILITARY GUNDAM MG',
    grade: 'MG',
    scale: '1/60',
    price: 55.00,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-rNCQhR3UWI-Hey7TL_5WHjsAB8s65WssTv_Rz4YmOjXqCLtVoj7SepBK&s=10',
    isActive: true,
    color: '#1E3A8A', // Deep Navy Blue
    description: 'Featuring the highly detailed Gundam Frame, this MG kit boasts a massive mace, tail blade with wire, and extreme articulation to pose in wild, beast-like stances.',
    rating: 4.8,
    reviews: 4219,
  },
  {
    id: '3',
    name: 'FREEDOM GUNDAM MG',
    grade: 'MG',
    scale: '1/60',
    price: 38.00,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRCEZ0xvR23e7BlEwM-Ky9fGJIzZz8iov8XWgPtCi54Q&s=10',
    isActive: true,
    color: '#2563EB', // Royal Blue
    description: 'From "The Witch from Mercury", this Real Grade kit offers unmatched detail density, color separation, and dynamic joint systems capturing the sleek look of the Aerial Rebuild.',
    rating: 4.9,
    reviews: 3105,
  },
  {
    id: '4',
    name: 'AKATSUKI GUNDAM MG',
    grade: 'MG',
    scale: '1/60',
    price: 28.00,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-h8duJWIDWaT3bycIRKQX-lOOj72pySI2PEweQmq9gBfcVju3ZEfpAzI&s=10',
    isActive: false,
    color: '#64748B', // Steel Slate
    description: 'Equipped with the psycho-frame test parts on its body, this high grade kit recreates the psycho-frame parts using beautiful clear pink runner pieces.',
    rating: 4.5,
    reviews: 1892,
  },
  {
    id: '5',
    name: 'CALIBANBARN GUNDAM MG',
    grade: 'MG',
    scale: '1/60',
    price: 12.50,
    image: 'https://o.lnwfile.com/_/o/_raw/cg/11/5y.jpg',
    isActive: true,
    color: '#94A3B8', // Light Slate/Gray
    description: 'A stylized Nu Gundam combining compact proportions with high weapon compatibility. Perfect for beginners and desk decoration.',
    rating: 4.6,
    reviews: 978,
  },
];
*/

const API_URL = 'http://119.59.102.161:3040/api/products';

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

function MainApp() {
  const insets = useSafeAreaInsets();
  // Navigation / Login / View Details States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const isAdmin = user?.username === 'admin';

  // App Core States
  const [products, setProducts] = useState<Product[]>([]);

  // Reusable fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const mappedProducts: Product[] = data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        grade: item.grade as 'PG' | 'MG' | 'RG' | 'HG' | 'SD',
        scale: item.scale,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        image_url: item.image_url || '',
        badge_status: item.badge_status === 'Active' ? 'Active' : 'Out of stock',
        color: item.color || '#2563EB',
        description: item.description || '',
        rating: typeof item.rating === 'string' ? parseFloat(item.rating) : (item.rating || 0),
        reviews: typeof item.reviews === 'string' ? parseInt(item.reviews, 10) : (item.reviews || 0),
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch product by ID details
  const viewProductDetails = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const mappedProduct: Product = {
        id: String(data.id),
        name: data.name,
        grade: data.grade as 'PG' | 'MG' | 'RG' | 'HG' | 'SD',
        scale: data.scale,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        image_url: data.image_url || '',
        badge_status: data.badge_status === 'Active' ? 'Active' : 'Out of stock',
        color: data.color || '#2563EB',
        description: data.description || '',
        rating: typeof data.rating === 'string' ? parseFloat(data.rating) : (data.rating || 0),
        reviews: typeof data.reviews === 'string' ? parseInt(data.reviews, 10) : (data.reviews || 0),
      };
      setSelectedProduct(mappedProduct);
    } catch (error) {
      console.error('Error fetching product details:', error);
      Alert.alert('Error', 'Could not load product details from server.');
    }
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'Home' | 'Add' | 'Products' | 'Categories'>('Home');
  const [filterCategory, setFilterCategory] = useState<'All' | 'PG' | 'MG' | 'RG' | 'HG' | 'SD'>('All');
  const [selectedScale, setSelectedScale] = useState<string>('1/144');

  // Add Product Form States
  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductPrice, setNewProductPrice] = useState<string>('');
  const [newProductGrade, setNewProductGrade] = useState<'PG' | 'MG' | 'RG' | 'HG' | 'SD'>('HG');
  const [newProductScale, setNewProductScale] = useState<string>('');
  const [newProductImageUrl, setNewProductImageUrl] = useState<string>('');
  const [newProductColor, setNewProductColor] = useState<string>('');
  const [newProductDesc, setNewProductDesc] = useState<string>('');
  const [newProductRating, setNewProductRating] = useState<string>('5.0');
  const [newProductReviews, setNewProductReviews] = useState<string>('0');

  // Edit Product States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProductName, setEditProductName] = useState<string>('');
  const [editProductPrice, setEditProductPrice] = useState<string>('');
  const [editProductGrade, setEditProductGrade] = useState<'PG' | 'MG' | 'RG' | 'HG' | 'SD'>('HG');
  const [editProductScale, setEditProductScale] = useState<string>('');
  const [editProductImageUrl, setEditProductImageUrl] = useState<string>('');
  const [editProductColor, setEditProductColor] = useState<string>('');
  const [editProductDesc, setEditProductDesc] = useState<string>('');
  const [editProductRating, setEditProductRating] = useState<string>('5.0');
  const [editProductReviews, setEditProductReviews] = useState<string>('0');

  // Web-safe Alert
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Authentication Handlers
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showAlert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://119.59.102.161:3040/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await response.json();

      if (!response.ok || !data.user) {
        showAlert('Authentication Failed', data.message || 'Invalid username or password.');
        return;
      }

      setUser(data.user);
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
      setActiveTab('Home'); // Default view
    } catch (error) {
      console.error('Login error:', error);
      showAlert('Error', 'Could not connect to the server.');
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      showAlert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://119.59.102.161:3040/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await response.json();

      if (!response.ok) {
        showAlert('Registration Failed', data.message || 'Could not register.');
        return;
      }

      showAlert('Success', data.message || 'Registered successfully! Please login.');
      setIsRegistering(false);
      setPassword('');
    } catch (error) {
      console.error('Registration error:', error);
      showAlert('Error', 'Could not connect to the server.');
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setSelectedProduct(null);
  };

  // Add Product Handler
  const handleAddProduct = async () => {
    if (!newProductName.trim()) {
      Alert.alert('Validation Error', 'Please enter a product name.');
      return;
    }
    const priceNum = parseFloat(newProductPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price (greater than 0).');
      return;
    }
    const ratingNum = parseFloat(newProductRating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      Alert.alert('Validation Error', 'Please enter a valid rating between 0 and 5.');
      return;
    }
    const reviewsNum = parseInt(newProductReviews, 10);
    if (isNaN(reviewsNum) || reviewsNum < 0) {
      Alert.alert('Validation Error', 'Please enter a valid number of reviews.');
      return;
    }

    const gradeColors = {
      PG: '#DC2626', // Brand Red
      MG: '#1E3A8A', // Deep Navy
      RG: '#2563EB', // Royal Blue
      HG: '#64748B', // Steel Slate
      SD: '#94A3B8', // Light Slate
    };

    const gradeScales = {
      PG: '1/60',
      MG: '1/100',
      RG: '1/144',
      HG: '1/144',
      SD: 'SD',
    };

    const finalScale = newProductScale.trim() || gradeScales[newProductGrade] || '1/144';
    const finalColor = newProductColor.trim() || gradeColors[newProductGrade] || '#2563EB';

    const payload = {
      name: newProductName.toUpperCase().trim(),
      grade: newProductGrade,
      scale: finalScale,
      price: priceNum,
      image_url: newProductImageUrl.trim() || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwqF5wCKg-m8EXDx6tCAfnzCbg4qXIFG_dIgAVaPLXggCnO4mLrNZ4nI0&s=10',
      badge_status: 'Active',
      color: finalColor,
      description: newProductDesc.trim() || `Authentic ${newProductGrade} scale model kit of the ${newProductName.trim()}. Easy assembly with premium runner molds.`,
      rating: ratingNum,
      reviews: reviewsNum,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Alert.alert('Success', 'Gunpla Model added to database successfully!');

      // Reset Form
      setNewProductName('');
      setNewProductPrice('');
      setNewProductGrade('HG');
      setNewProductScale('');
      setNewProductImageUrl('');
      setNewProductColor('');
      setNewProductDesc('');
      setNewProductRating('5.0');
      setNewProductReviews('0');

      // Refresh list
      await fetchProducts();

      setActiveTab('Products');
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Could not add product to server.');
    }
  };

  // Start Edit Mode
  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setEditProductName(product.name);
    setEditProductPrice(String(product.price));
    setEditProductGrade(product.grade);
    setEditProductScale(product.scale);
    setEditProductImageUrl(product.image_url);
    setEditProductColor(product.color);
    setEditProductDesc(product.description);
    setEditProductRating(String(product.rating));
    setEditProductReviews(String(product.reviews));
  };

  // Submit Edit Handler
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    if (!editProductName.trim()) {
      Alert.alert('Validation Error', 'Please enter a product name.');
      return;
    }
    const priceNum = parseFloat(editProductPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price (greater than 0).');
      return;
    }
    const ratingNum = parseFloat(editProductRating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      Alert.alert('Validation Error', 'Please enter a valid rating between 0 and 5.');
      return;
    }
    const reviewsNum = parseInt(editProductReviews, 10);
    if (isNaN(reviewsNum) || reviewsNum < 0) {
      Alert.alert('Validation Error', 'Please enter a valid number of reviews.');
      return;
    }

    const payload = {
      name: editProductName.toUpperCase().trim(),
      grade: editProductGrade,
      scale: editProductScale.trim() || '1/144',
      price: priceNum,
      image_url: editProductImageUrl.trim() || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwqF5wCKg-m8EXDx6tCAfnzCbg4qXIFG_dIgAVaPLXggCnO4mLrNZ4nI0&s=10',
      badge_status: 'Active',
      color: editProductColor.trim() || '#2563EB',
      description: editProductDesc.trim(),
      rating: ratingNum,
      reviews: reviewsNum,
    };

    try {
      const response = await fetch(`${API_URL}/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Alert.alert('Success', 'Gunpla Model updated successfully!');
      setEditingProduct(null);

      // Refresh list
      await fetchProducts();

      // Refresh Detail View if active
      if (selectedProduct && selectedProduct.id === editingProduct.id) {
        viewProductDetails(editingProduct.id);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Could not update product on the server.');
    }
  };

  // Toggle Active Status via Server
  const toggleProductStatus = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const newStatus = product.badge_status === 'Active' ? 'Out of stock' : 'Active';
    const payload = {
      name: product.name,
      grade: product.grade,
      scale: product.scale,
      price: product.price,
      image_url: product.image_url,
      badge_status: newStatus,
      color: product.color,
      description: product.description,
      rating: product.rating,
      reviews: product.reviews,
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setProducts(
        products.map((p) => (p.id === id ? { ...p, badge_status: newStatus as 'Active' | 'Out of stock' } : p))
      );
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct({ ...selectedProduct, badge_status: newStatus as 'Active' | 'Out of stock' });
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      Alert.alert('Error', 'Could not update status on server.');
    }
  };

  // Delete Product via Server
  const deleteProduct = (id: string) => {
    Alert.alert(
      'Remove Product',
      'Are you sure you want to remove this Gunpla kit from the backend database?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              Alert.alert('Success', 'Product removed from database.');
              await fetchProducts();

              if (selectedProduct && selectedProduct.id === id) {
                setSelectedProduct(null);
              }
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Could not delete product from server.');
            }
          },
        },
      ]
    );
  };

  // Filtering Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.grade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.grade === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats for Categories / Dashboard
  const categoryStats = ['PG', 'MG', 'RG', 'HG', 'SD'].map((grade) => {
    const items = products.filter((p) => p.grade === grade);
    const percentage = products.length > 0 ? (items.length / products.length) * 100 : 0;
    return {
      grade,
      count: items.length,
      percentage,
      activeCount: items.filter((p) => p.badge_status === 'Active').length,
    };
  });

  // RENDER LOGIN SCREEN (Clean Light theme matching Reebok app card style)
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.loginContainer}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.loginCard}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://i.pinimg.com/736x/0b/6b/98/0b6b98c6538a7df953d7395e363fc2f6.jpg' }}
                style={styles.logoImage}
              />
              <Text style={styles.loginTitle}>GUNPLA BASE</Text>
              <Text style={styles.loginSubtitle}>
                {isRegistering ? 'Register New Account' : 'Gunpla E-commerce Manager'}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>USERNAME</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Username"
                placeholderTextColor="#A0A8BA"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Password"
                placeholderTextColor="#A0A8BA"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={isRegistering ? handleRegister : handleLogin}
            >
              <Text style={styles.loginButtonText}>
                {isRegistering ? 'REGISTER ACCOUNT' : 'LAUNCH STATION'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 16, alignItems: 'center' }}
              onPress={() => setIsRegistering(!isRegistering)}
            >
              <Text style={{ color: '#2563EB', fontSize: 13, fontWeight: '600' }}>
                {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
              </Text>
            </TouchableOpacity>

            {!isRegistering && (
              <View style={styles.credentialTip}>
                <Text style={styles.tipTitle}>💡 Admin Instructions</Text>
                <Text style={styles.tipText}>
                  Admin Use: <Text style={styles.boldText}>admin</Text> / <Text style={styles.boldText}>123456</Text>
                </Text>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // RENDER PRODUCT DETAIL VIEW (Reebok Product Details Screen Style)
  if (selectedProduct) {
    return (
      <SafeAreaView style={styles.detailContainer}>
        <StatusBar barStyle="dark-content" />

        {/* Top Header Row with Back, Edit and Status toggle */}
        <View style={styles.detailHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedProduct(null)}>
            <Text style={styles.backBtnIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.detailTitleText}>PRODUCT DETAILS</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Main Hero Product Image with colored background box */}
          <View style={[styles.detailHeroImageBg, { backgroundColor: selectedProduct.color }]}>
            {selectedProduct.image_url.startsWith('http') ? (
              <Image source={{ uri: selectedProduct.image_url }} style={styles.detailHeroImage} />
            ) : (
              <Text style={styles.detailHeroEmoji}>{selectedProduct.image_url}</Text>
            )}
          </View>

          {/* Product Details Section */}
          <View style={styles.detailContent}>
            <View style={styles.detailNameRow}>
              <Text style={styles.detailName}>{selectedProduct.name}</Text>
              <Text style={styles.detailPrice}>${selectedProduct.price.toFixed(2)}</Text>
            </View>

            {/* Rating Stars row */}
            <View style={styles.detailRatingRow}>
              <Text style={styles.starsText}>Rating: {selectedProduct.rating.toFixed(1)} / 5.0</Text>
              <Text style={styles.reviewsCountText}>({selectedProduct.reviews.toLocaleString()} Reviews)</Text>
            </View>

            {/* Description */}
            <Text style={styles.detailDescTitle}>Description</Text>
            <Text style={styles.detailDescText}>{selectedProduct.description}</Text>

            {/* Size / Scale selector like Reebok App */}
            <View style={styles.scaleSelectorRow}>
              <Text style={styles.scaleSelectorTitle}>Scale / Grade Options</Text>
              <View style={styles.scaleTabsRow}>
                <Text style={styles.scaleTabUnit}>USA</Text>
                <Text style={styles.scaleTabUnitActive}>JPN</Text>
                <Text style={styles.scaleTabUnit}>INT</Text>
              </View>
            </View>

            {/* Scale options grid */}
            <View style={styles.scaleOptionsGrid}>
              {['1/144', '1/100', '1/60', 'SD', 'RE/100'].map((scale) => (
                <TouchableOpacity
                  key={scale}
                  style={[
                    styles.scaleOptionBtn,
                    (selectedScale === scale || selectedProduct.scale === scale) && styles.scaleOptionBtnActive,
                  ]}
                  onPress={() => setSelectedScale(scale)}
                >
                  <Text
                    style={[
                      styles.scaleOptionText,
                      (selectedScale === scale || selectedProduct.scale === scale) && styles.scaleOptionTextActive,
                    ]}
                  >
                    {scale}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Floating bottom buy button */}
        <View style={styles.detailBottomBar}>
          <TouchableOpacity
            style={[styles.addToBagBtn, { backgroundColor: '#3CE0B0' }]}
            onPress={() => {
              showAlert(
                'Purchase Successful',
                `You have successfully bought ${selectedProduct.name}!`
              );
              if (!isAdmin) {
                // Mock purchase: remove from state for users
                setProducts(products.filter(p => p.id !== selectedProduct.id));
              }
              setSelectedProduct(null);
            }}
          >
            <Text style={styles.addToBagBtnText}>BUY NOW</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // RENDER APP MAIN SCREEN (Reebok style list and UI flow)
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* 1. HEADER (Explore title on Left, profile avatar on Right) */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Explore</Text>
          <View style={styles.headerRightActions}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>LOGOUT</Text>
            </TouchableOpacity>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>🧑‍✈️</Text>
            </View>
          </View>
        </View>

        {/* Search Bar / Add Button row (Hide on Add Tab) */}
        {activeTab !== 'Add' && (
          <>
            <View style={styles.searchBarRow}>
              <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search Gunpla models..."
                  placeholderTextColor="#A0A8BA"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* Quick Add Shortcut */}
              {isAdmin && (
                <TouchableOpacity style={styles.headerAddBtn} onPress={() => setActiveTab('Add')}>
                  <Text style={styles.headerAddBtnText}>+ Add</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Categories Quick Filter Pill list */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterPillList}
              contentContainerStyle={styles.filterPillListContent}
            >
              {(['All', 'PG', 'MG', 'RG', 'HG', 'SD'] as const).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filterPill,
                    filterCategory === cat && styles.filterPillActive,
                  ]}
                  onPress={() => setFilterCategory(cat)}
                >
                  <Text style={styles.filterPillIcon}>
                    {cat === 'All' && '🤖'}
                    {cat === 'PG' && '🏆'}
                    {cat === 'MG' && '🛡️'}
                    {cat === 'RG' && '⚔️'}
                    {cat === 'HG' && '✈️'}
                    {cat === 'SD' && '🧸'}
                  </Text>
                  <Text
                    style={[
                      styles.filterPillText,
                      filterCategory === cat && styles.filterPillTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Removed Segmented Control */}
      </View>

      {/* 2. BODY CONTENT AREA */}
      <View style={styles.body}>

        {/* --- HOME TAB VIEW (Explore) --- */}
        {activeTab === 'Home' && (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>EXPLORE RELEASES</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.featuredScrollView}
              contentContainerStyle={styles.featuredContentStyle}
            >
              {filteredProducts.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.featuredCard}
                  onPress={() => viewProductDetails(item.id)}
                >
                  {/* Styled Image background with Reebok colored corner style */}
                  <View style={[styles.featuredImageBg, { backgroundColor: item.color }]}>
                    {item.image_url.startsWith('http') ? (
                      <Image source={{ uri: item.image_url }} style={styles.featuredImage} />
                    ) : (
                      <Text style={styles.featuredEmoji}>{item.image_url}</Text>
                    )}
                  </View>

                  {/* Product Details under image */}
                  <Text style={styles.featuredPrice}>${item.price.toFixed(0)}</Text>

                  <View style={styles.featuredRatingRow}>
                    <Text style={styles.featuredStars}>Rating: {item.rating.toFixed(1)} / 5.0</Text>
                  </View>

                  <Text style={styles.featuredName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={{ height: 30 }} />
          </ScrollView>
        )}

        {/* --- PRODUCTS TAB VIEW (Standard list + active actions) --- */}
        {activeTab === 'Products' && (
          <View style={styles.productsTabContainer}>
            <View style={styles.productsSummaryHeader}>
              <Text style={styles.resultsText}>
                Showing {filteredProducts.length} model kits in stock
              </Text>
            </View>

            {filteredProducts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🛰️</Text>
                <Text style={styles.emptyTitle}>No Kits Found</Text>
                <Text style={styles.emptySubtitle}>
                  Try clearing search query or choosing another category/status filter.
                </Text>
                <TouchableOpacity
                  style={styles.clearFilterBtn}
                  onPress={() => {
                    setSearchQuery('');
                    setFilterCategory('All');
                  }}
                >
                  <Text style={styles.clearFilterBtnText}>Reset Filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} style={styles.productsScrollView}>
                {filteredProducts.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.productCard}
                    onPress={() => viewProductDetails(item.id)}
                  >
                    {/* Visual Card Image with gradient styling */}
                    <View style={[styles.productImageContainer, { backgroundColor: item.color }]}>
                      {item.image_url.startsWith('http') ? (
                        <Image source={{ uri: item.image_url }} style={styles.productImage} />
                      ) : (
                        <Text style={styles.productEmoji}>{item.image_url}</Text>
                      )}
                      <View style={styles.gradeBadgeOverlay}>
                        <Text style={styles.gradeBadgeText}>{item.grade}</Text>
                      </View>
                    </View>

                    {/* Card Content details */}
                    <View style={styles.productDetailsContainer}>
                      <Text style={styles.productCardTitle} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Text style={styles.productCardPrice}>${item.price.toFixed(2)}</Text>
                    </View>

                    {/* Action buttons (Edit & Delete) */}
                    {isAdmin && (
                      <View style={styles.productActions}>
                        <TouchableOpacity
                          style={[styles.deleteBtn, { marginBottom: 8 }]}
                          onPress={() => handleStartEdit(item)}
                        >
                          <Text style={styles.deleteBtnText}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => deleteProduct(item.id)}
                        >
                          <Text style={styles.deleteBtnText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
                <View style={{ height: 40 }} />
              </ScrollView>
            )}
          </View>
        )}

        {/* --- ADD PRODUCT TAB VIEW --- */}
        {activeTab === 'Add' && (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            <View style={styles.addFormContainer}>
              <Text style={styles.formSectionTitle}>🤖 Hangar Intake Form</Text>
              <Text style={styles.formSectionDesc}>
                Register a new mobile suit kit to the store catalog.
              </Text>

              {/* Form Input fields */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>GUNPLA MODEL NAME</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. GUNDAM EXIA (RG 1/144)"
                  placeholderTextColor="#A0A8BA"
                  value={newProductName}
                  onChangeText={setNewProductName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>PRICE (USD)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. 45.00"
                  placeholderTextColor="#A0A8BA"
                  value={newProductPrice}
                  onChangeText={setNewProductPrice}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>SCALE</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. 1/144 (Leave empty for default)"
                  placeholderTextColor="#A0A8BA"
                  value={newProductScale}
                  onChangeText={setNewProductScale}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>IMAGE URL</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. https://..."
                  placeholderTextColor="#A0A8BA"
                  value={newProductImageUrl}
                  onChangeText={setNewProductImageUrl}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>COLOR HEX CODE</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. #2563EB (Leave empty for default)"
                  placeholderTextColor="#A0A8BA"
                  value={newProductColor}
                  onChangeText={setNewProductColor}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>RATING (0.0 - 5.0)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. 5.0"
                  placeholderTextColor="#A0A8BA"
                  value={newProductRating}
                  onChangeText={setNewProductRating}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>REVIEWS COUNT</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. 120"
                  placeholderTextColor="#A0A8BA"
                  value={newProductReviews}
                  onChangeText={setNewProductReviews}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>KIT DESCRIPTION</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputArea]}
                  placeholder="Enter details about assembly, accessories, and scaling..."
                  placeholderTextColor="#A0A8BA"
                  value={newProductDesc}
                  onChangeText={setNewProductDesc}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Grade Selection Row */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>GUNPLA GRADE CATEGORY</Text>
                <View style={styles.gradeGrid}>
                  {(['PG', 'MG', 'RG', 'HG', 'SD'] as const).map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.gradeSelectBtn,
                        newProductGrade === g && styles.gradeSelectBtnActive,
                      ]}
                      onPress={() => setNewProductGrade(g)}
                    >
                      <Text
                        style={[
                          styles.gradeSelectBtnText,
                          newProductGrade === g && styles.gradeSelectBtnTextActive,
                        ]}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Submit button */}
              <TouchableOpacity style={styles.formSubmitBtn} onPress={handleAddProduct}>
                <Text style={styles.formSubmitBtnText}>DEPLOY TO CATALOG</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* --- CATEGORIES TAB VIEW --- */}
        {activeTab === 'Categories' && (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            <View style={styles.categoriesHeader}>
              <Text style={styles.categoriesTitle}>🗂️ Gunpla Grade Breakdown</Text>
              <Text style={styles.categoriesSubtitle}>
                Current inventory levels grouped by model design complexity.
              </Text>
            </View>

            {categoryStats.map((stat) => (
              <View key={stat.grade} style={styles.categoryReportCard}>
                <View style={styles.categoryCardHeader}>
                  <View style={styles.gradeInfoRow}>
                    <Text style={styles.categoryGradeTitle}>{stat.grade} Grade</Text>
                    <Text style={styles.categoryGradeScale}>
                      {stat.grade === 'PG' && 'Perfect Grade (1/60 Scale)'}
                      {stat.grade === 'MG' && 'Master Grade (1/100 Scale)'}
                      {stat.grade === 'RG' && 'Real Grade (1/144 Premium)'}
                      {stat.grade === 'HG' && 'High Grade (1/144 Standard)'}
                      {stat.grade === 'SD' && 'Super Deformed (Chibi Scale)'}
                    </Text>
                  </View>
                  <Text style={styles.categoryCountBadge}>{stat.count} Kits</Text>
                </View>

                {/* Progress bar representer */}
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${stat.percentage || 1}%`,
                        backgroundColor:
                          stat.grade === 'PG'
                            ? '#DC2626'
                            : stat.grade === 'MG'
                              ? '#1E3A8A'
                              : stat.grade === 'RG'
                                ? '#2563EB'
                                : stat.grade === 'HG'
                                  ? '#64748B'
                                  : '#94A3B8',
                      },
                    ]}
                  />
                </View>

                <View style={styles.categoryCardFooter}>
                  <Text style={styles.categoryMetaText}>
                    Active listings: {stat.activeCount}
                  </Text>
                  <Text style={styles.categoryMetaText}>
                    {stat.percentage.toFixed(0)}% of stock
                  </Text>
                </View>
              </View>
            ))}

            <View style={{ height: 40 }} />
          </ScrollView>
        )}

      </View>

      {/* 3. BOTTOM NAVIGATION (Reebok style menu layout) */}
      <SafeAreaView edges={['bottom']} style={styles.bottomNavSafeArea}>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('Home')}
          >
            <Text style={[styles.navIcon, activeTab === 'Home' && styles.navIconActiveColor]}>🏠</Text>
            <Text style={[styles.navText, activeTab === 'Home' && styles.navTextActive]}>
              Explore
            </Text>
          </TouchableOpacity>

          {isAdmin && (
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setActiveTab('Add')}
            >
              <Text style={[styles.navIcon, activeTab === 'Add' && styles.navIconActiveColor]}>🎁</Text>
              <Text style={[styles.navText, activeTab === 'Add' && styles.navTextActive]}>
                Add Gift
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('Products')}
          >
            <Text style={[styles.navIcon, activeTab === 'Products' && styles.navIconActiveColor]}>🛒</Text>
            <Text style={[styles.navText, activeTab === 'Products' && styles.navTextActive]}>
              Products
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={editingProduct !== null}
        animationType="slide"
        onRequestClose={() => setEditingProduct(null)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setEditingProduct(null)}>
              <Text style={styles.backBtnIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.detailTitleText}>EDIT GUNDAM MODEL</Text>
            <View style={{ width: 36 }} />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScrollView}>
              <View style={styles.addFormContainer}>

                {/* Form Input fields */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>GUNPLA MODEL NAME</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. GUNDAM EXIA"
                    placeholderTextColor="#A0A8BA"
                    value={editProductName}
                    onChangeText={setEditProductName}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>PRICE (USD)</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. 45.00"
                    placeholderTextColor="#A0A8BA"
                    value={editProductPrice}
                    onChangeText={setEditProductPrice}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>SCALE</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. 1/144"
                    placeholderTextColor="#A0A8BA"
                    value={editProductScale}
                    onChangeText={setEditProductScale}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>IMAGE URL</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. https://..."
                    placeholderTextColor="#A0A8BA"
                    value={editProductImageUrl}
                    onChangeText={setEditProductImageUrl}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>COLOR HEX CODE</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. #2563EB"
                    placeholderTextColor="#A0A8BA"
                    value={editProductColor}
                    onChangeText={setEditProductColor}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>RATING (0.0 - 5.0)</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. 4.8"
                    placeholderTextColor="#A0A8BA"
                    value={editProductRating}
                    onChangeText={setEditProductRating}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>REVIEWS COUNT</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. 120"
                    placeholderTextColor="#A0A8BA"
                    value={editProductReviews}
                    onChangeText={setEditProductReviews}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>KIT DESCRIPTION</Text>
                  <TextInput
                    style={[styles.formInput, styles.formInputArea]}
                    placeholder="Enter details..."
                    placeholderTextColor="#A0A8BA"
                    value={editProductDesc}
                    onChangeText={setEditProductDesc}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* Grade Selection */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>GUNPLA GRADE CATEGORY</Text>
                  <View style={styles.gradeGrid}>
                    {(['PG', 'MG', 'RG', 'HG', 'SD'] as const).map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[
                          styles.gradeSelectBtn,
                          editProductGrade === g && styles.gradeSelectBtnActive,
                        ]}
                        onPress={() => setEditProductGrade(g)}
                      >
                        <Text
                          style={[
                            styles.gradeSelectBtnText,
                            editProductGrade === g && styles.gradeSelectBtnTextActive,
                          ]}
                        >
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {/* Save button */}
                <TouchableOpacity style={styles.formSubmitBtn} onPress={handleUpdateProduct}>
                  <Text style={styles.formSubmitBtnText}>SAVE CHANGES</Text>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

// CSS STYLING (StyleSheet.create - Theme: Reebok Light/Mint and Coral Red)
const styles = StyleSheet.create({
  // LOGIN SCREEN STYLING (Light clean UI matching Reebok card aesthetics)
  loginContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#1A1D24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1D24',
    letterSpacing: 2,
  },
  loginSubtitle: {
    fontSize: 13,
    color: '#8D93A3',
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1A1D24',
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  textInput: {
    width: '100%',
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#1A1D24',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 15,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2563EB', // Theme Royal Blue
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1.5,
  },
  credentialTip: {
    marginTop: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tipTitle: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tipText: {
    color: '#8D93A3',
    fontSize: 12,
  },
  boldText: {
    color: '#1A1D24',
    fontWeight: 'bold',
  },

  // MAIN SCREEN CONTAINER
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB', // Light backgrounds
  },

  // HEADER STYLING (Reebok explore theme style)
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#1A1D24',
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  profileAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileAvatarText: {
    fontSize: 20,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#1A1D24',
    fontSize: 14,
    height: '100%',
  },
  headerAddBtn: {
    backgroundColor: '#2563EB', // Theme Royal Blue
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAddBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  filterPillList: {
    marginTop: 2,
    marginBottom: 14,
  },
  filterPillListContent: {
    gap: 12,
    paddingRight: 16,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#1A1D24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  filterPillActive: {
    backgroundColor: '#2563EB', // Theme Royal Blue
    borderColor: '#2563EB',
  },
  filterPillIcon: {
    fontSize: 16,
  },
  filterPillText: {
    color: '#8D93A3',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  segmentedControlContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    padding: 3,
    height: 40,
    width: '100%',
  },
  segmentBtn: {
    flex: 1,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#2563EB', // Theme Royal Blue
  },
  segmentBtnText: {
    color: '#8D93A3',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
  },

  // BODY & TAB CONTAINER STYLING
  body: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },

  // HERO BANNER STYLING (Premium Red Box Reebok Style)
  heroCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#1A1D24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  heroTextContent: {
    flex: 1,
    paddingRight: 12,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DC2626', // Theme Coral Red
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#1A1D24',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heroDesc: {
    color: '#8D93A3',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  heroPrice: {
    color: '#DC2626',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heroBtn: {
    backgroundColor: '#2563EB', // Mint active arrow button
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  heroBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // METRICS STYLING
  sectionTitle: {
    color: '#1A1D24',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  seeAllLink: {
    color: '#2563EB', // Theme Mint color
    fontSize: 11,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#1A1D24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  statsNumber: {
    color: '#1A1D24',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsLabel: {
    color: '#8D93A3',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },

  // FEATURED ITEMS STYLING (Reebok Cards Layout)
  featuredScrollView: {
    marginBottom: 24,
  },
  featuredContentStyle: {
    gap: 14,
  },
  featuredCard: {
    width: 145,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#1A1D24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  featuredImageBg: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  featuredEmoji: {
    fontSize: 48,
  },
  cardAddButtonFloat: {
    position: 'absolute',
    bottom: -8,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A1D24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardAddButtonFloatText: {
    color: '#1A1D24',
    fontSize: 13,
    fontWeight: 'bold',
  },
  featuredPrice: {
    color: '#DC2626', // Brand Red price
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  featuredRatingRow: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 4,
  },
  featuredStars: {
    fontSize: 8,
    letterSpacing: 0.5,
  },
  featuredName: {
    color: '#8D93A3',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },

  // PRODUCTS LIST TAB STYLING
  productsTabContainer: {
    flex: 1,
  },
  productsSummaryHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsText: {
    color: '#8D93A3',
    fontSize: 12,
  },
  productsScrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    shadowColor: '#1A1D24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  productImageContainer: {
    width: 75,
    height: 75,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productEmoji: {
    fontSize: 34,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'contain',
  },
  gradeBadgeOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(26, 29, 36, 0.8)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gradeBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  productDetailsContainer: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: 'center',
  },
  productCardTitle: {
    color: '#1A1D24',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productCardPrice: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statusToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    color: '#8D93A3',
    fontSize: 11,
    marginRight: 8,
  },
  statusSwitch: {
    transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
    marginLeft: -4,
  },
  productActions: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  deleteBtnText: {
    fontSize: 13,
  },

  // EMPTY STATE STYLING
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#1A1D24',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#8D93A3',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  clearFilterBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clearFilterBtnText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 13,
  },

  // ADD FORM STYLING
  addFormContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 30,
    shadowColor: '#1A1D24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  formSectionTitle: {
    color: '#1A1D24',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  formSectionDesc: {
    color: '#8D93A3',
    fontSize: 12,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 18,
  },
  formLabel: {
    color: '#1A1D24',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F3F4F6',
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    color: '#1A1D24',
    fontSize: 14,
  },
  formInputArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  gradeGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  gradeSelectBtn: {
    flex: 1,
    height: 38,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  gradeSelectBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  gradeSelectBtnText: {
    color: '#8D93A3',
    fontWeight: '600',
    fontSize: 12,
  },
  gradeSelectBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  formSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  formSwitchDesc: {
    color: '#8D93A3',
    fontSize: 11,
    marginTop: 2,
  },
  formSubmitBtn: {
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  formSubmitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },

  // CATEGORIES TAB STYLING
  categoriesHeader: {
    marginBottom: 20,
  },
  categoriesTitle: {
    color: '#1A1D24',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoriesSubtitle: {
    color: '#8D93A3',
    fontSize: 12,
  },
  categoryReportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    shadowColor: '#1A1D24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gradeInfoRow: {
    flex: 1,
  },
  categoryGradeTitle: {
    color: '#1A1D24',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryGradeScale: {
    color: '#8D93A3',
    fontSize: 11,
    marginTop: 2,
  },
  categoryCountBadge: {
    color: '#FFFFFF',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginBottom: 10,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  categoryCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryMetaText: {
    color: '#8D93A3',
    fontSize: 11,
  },

  // BOTTOM NAVIGATION BAR STYLING (Reebok Style Custom Nav)
  bottomNavSafeArea: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  navIcon: {
    fontSize: 18,
    color: '#8D93A3',
  },
  navIconActiveColor: {
    color: '#2563EB', // Active Tab Color
  },
  navText: {
    fontSize: 9,
    color: '#8D93A3',
    fontWeight: 'bold',
  },
  navTextActive: {
    color: '#1A1D24',
    fontWeight: 'bold',
  },
  centerFloatingNavWrapper: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingCartBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -15,
    shadowColor: '#1A1D24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  floatingCartBtnActive: {
    backgroundColor: '#2563EB', // Floating button turns mint when active!
    borderColor: '#2563EB',
  },
  floatingCartIcon: {
    fontSize: 22,
  },

  // PRODUCT DETAIL VIEW STYLING (Reebok Product Details screen)
  detailContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1D24',
  },
  detailTitleText: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1D24',
    letterSpacing: 1,
    zIndex: -1,
  },
  detailStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  detailStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  detailHeroImageBg: {
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 36,
    overflow: 'hidden',
  },
  detailHeroEmoji: {
    fontSize: 110,
  },
  detailHeroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  detailContent: {
    padding: 20,
  },
  detailNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailName: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1D24',
    paddingRight: 12,
    lineHeight: 28,
  },
  detailPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626', // Red Run style price
  },
  detailRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  starsText: {
    fontSize: 14,
    letterSpacing: 1,
  },
  reviewsCountText: {
    color: '#8D93A3',
    fontSize: 13,
    fontWeight: '500',
  },
  detailDescTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1D24',
    marginBottom: 6,
  },
  detailDescText: {
    fontSize: 14,
    color: '#8D93A3',
    lineHeight: 20,
    marginBottom: 24,
  },
  scaleSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scaleSelectorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1D24',
  },
  scaleTabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  scaleTabUnit: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8D93A3',
  },
  scaleTabUnitActive: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2563EB', // Active unit
  },
  scaleOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },
  scaleOptionBtn: {
    width: 60,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  scaleOptionBtnActive: {
    backgroundColor: '#2563EB', // Reebok active select option
    borderColor: '#2563EB',
  },
  scaleOptionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1D24',
  },
  scaleOptionTextActive: {
    color: '#FFFFFF',
  },
  detailBottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  addToBagBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  addToBagBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  editHeaderBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editHeaderBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1D24',
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalScrollView: {
    flex: 1,
    padding: 16,
  },
});
