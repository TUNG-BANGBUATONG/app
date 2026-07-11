package com.example

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ui.theme.MyApplicationTheme
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

// ==========================================
// 1. DATA MODEL
// ==========================================
data class Product(
    val id: String,
    val name: String,
    val price: Double,
    val category: String,
    val status: String, // "Active" or "Inactive"
    val emoji: String,
    val description: String = ""
)

// ==========================================
// 2. VIEWMODEL FOR STATE MANAGEMENT
// ==========================================
class CatalogViewModel : ViewModel() {
    private val _isLoggedIn = MutableStateFlow(true)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    private val _username = MutableStateFlow("Customer")
    val username: StateFlow<String> = _username.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCategory = MutableStateFlow<String?>(null)
    val selectedCategory: StateFlow<String?> = _selectedCategory.asStateFlow()

    private val _selectedStatus = MutableStateFlow<String?>(null)
    val selectedStatus: StateFlow<String?> = _selectedStatus.asStateFlow()

    private val _currentTab = MutableStateFlow("home") // "home", "add", "products", "categories"
    val currentTab: StateFlow<String> = _currentTab.asStateFlow()

    private val _showFilterDialog = MutableStateFlow(false)
    val showFilterDialog: StateFlow<Boolean> = _showFilterDialog.asStateFlow()

    private val _selectedProductForDetail = MutableStateFlow<Product?>(null)
    val selectedProductForDetail: StateFlow<Product?> = _selectedProductForDetail.asStateFlow()

    // Mock products data
    private val _productList = MutableStateFlow<List<Product>>(
        listOf(
            Product(
                id = "1",
                name = "Unisex T-Shirt White",
                price = 350.0,
                category = "Clothing",
                status = "Active",
                emoji = "👕",
                description = "100% premium combed cotton, ultra-soft, breathable, and highly comfortable unisex design. Perfect for everyday casual wear."
            ),
            Product(
                id = "2",
                name = "Retro Sneaker Black",
                price = 1250.0,
                category = "Shoes",
                status = "Active",
                emoji = "👟",
                description = "Classic vintage sneakers featuring highly durable rubber soles, soft padded insoles, and premium faux-leather outer material."
            ),
            Product(
                id = "3",
                name = "Canvas Tote Bag",
                price = 180.0,
                category = "Accessories",
                status = "Active",
                emoji = "👜",
                description = "Eco-friendly reusable cotton canvas shoulder bag. Extremely spacious, sturdy straps, and comes with an inside zip pocket."
            ),
            Product(
                id = "4",
                name = "Slim Denim Jeans",
                price = 890.0,
                category = "Clothing",
                status = "Inactive",
                emoji = "👖",
                description = "Form-fitting denim jeans made with comfortable stretch fabric, classic five-pocket styling, and metallic zip fly closure."
            ),
            Product(
                id = "5",
                name = "Wireless Bluetooth Earbuds",
                price = 1590.0,
                category = "Electronics",
                status = "Active",
                emoji = "🎧",
                description = "True wireless bluetooth stereo earphones featuring active hybrid noise cancellation, sweat resistance, and 24-hour total playback battery life."
            ),
            Product(
                id = "6",
                name = "Smart Watch Slate",
                price = 2990.0,
                category = "Electronics",
                status = "Active",
                emoji = "⌚",
                description = "Smartwear sports watch with high-resolution AMOLED display, blood oxygen monitor, multi-sport activity tracking, and up to 10 days of battery."
            ),
            Product(
                id = "7",
                name = "Leather Bi-fold Wallet",
                price = 450.0,
                category = "Accessories",
                status = "Active",
                emoji = "👛",
                description = "Handcrafted genuine full-grain leather bifold wallet with built-in RFID blocking security sheets, 8 card slots, and dual cash slots."
            ),
            Product(
                id = "8",
                name = "Running Shoes Neon",
                price = 1890.0,
                category = "Shoes",
                status = "Inactive",
                emoji = "🏃",
                description = "Lightweight performance running sneakers built with responsive cushioning foam midsoles and flexible knit mesh uppers."
            )
        )
    )
    val productList: StateFlow<List<Product>> = _productList.asStateFlow()

    // Core actions
    fun login(user: String, pass: String): Boolean {
        return if (user.trim().isNotEmpty() && pass.trim().isNotEmpty()) {
            _username.value = user.trim()
            _isLoggedIn.value = true
            true
        } else {
            false
        }
    }

    fun logout() {
        _isLoggedIn.value = false
        _username.value = ""
        _searchQuery.value = ""
        _selectedCategory.value = null
        _selectedStatus.value = null
        _currentTab.value = "home"
    }

    fun setTab(tab: String) {
        _currentTab.value = tab
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setCategoryFilter(category: String?) {
        _selectedCategory.value = category
    }

    fun setStatusFilter(status: String?) {
        _selectedStatus.value = status
    }

    fun setShowFilterDialog(show: Boolean) {
        _showFilterDialog.value = show
    }

    fun setSelectedProduct(product: Product?) {
        _selectedProductForDetail.value = product
    }

    fun addProduct(name: String, price: Double, category: String, status: String, emoji: String, description: String) {
        val newProduct = Product(
            id = (System.currentTimeMillis()).toString(),
            name = name,
            price = price,
            category = category,
            status = status,
            emoji = emoji.ifEmpty { "📦" },
            description = description.ifEmpty { "No description provided." }
        )
        _productList.value = listOf(newProduct) + _productList.value
        // Switch back to Products list to let them see it immediately
        _currentTab.value = "products"
    }

    fun toggleProductStatus(productId: String) {
        _productList.value = _productList.value.map {
            if (it.id == productId) {
                it.copy(status = if (it.status == "Active") "Inactive" else "Active")
            } else {
                it
            }
        }
        // Update detail dialog state too if it's currently showing this product
        _selectedProductForDetail.value?.let { current ->
            if (current.id == productId) {
                _selectedProductForDetail.value = current.copy(
                    status = if (current.status == "Active") "Inactive" else "Active"
                )
            }
        }
    }

    fun deleteProduct(productId: String) {
        _productList.value = _productList.value.filter { it.id != productId }
        _selectedProductForDetail.value = null
    }
}

// ==========================================
// 3. MAIN ACTIVITY
// ==========================================
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                MainAppContent()
            }
        }
    }
}

@Composable
fun MainAppContent() {
    val viewModel: CatalogViewModel = viewModel()
    MainNavigationContainer(viewModel = viewModel)
}

// ==========================================
// 4. LOGIN SCREEN
// ==========================================
@Composable
fun LoginScreen(onLoginSuccess: (String, String) -> Boolean) {
    var usernameInput by remember { mutableStateOf("") }
    var passwordInput by remember { mutableStateOf("") }
    var loginError by remember { mutableStateOf(false) }
    var passwordVisible by remember { mutableStateOf(false) }

    val context = LocalContext.current
    val focusManager = LocalFocusManager.current

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f),
                        MaterialTheme.colorScheme.surface
                    )
                )
            )
            .statusBarsPadding()
            .navigationBarsPadding(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .widthIn(max = 420.dp)
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Logo Icon / Mascot
            Box(
                modifier = Modifier
                    .size(86.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(MaterialTheme.colorScheme.primary)
                    .shadow(4.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "🛍️",
                    fontSize = 44.sp,
                    textAlign = TextAlign.Center
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Brand Header
            Text(
                text = "Catalog Go",
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                ),
                textAlign = TextAlign.Center
            )

            Text(
                text = "แอปพลิเคชันระบบแคตตาล็อกสินค้าอัจฉริยะ",
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                ),
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Card Container for Form
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(8.dp, shape = RoundedCornerShape(24.dp)),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                shape = RoundedCornerShape(24.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp)
                ) {
                    Text(
                        text = "เข้าสู่ระบบ",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        ),
                        modifier = Modifier.padding(bottom = 16.dp)
                    )

                    // Email / Username Input
                    OutlinedTextField(
                        value = usernameInput,
                        onValueChange = {
                            usernameInput = it
                            loginError = false
                        },
                        label = { Text("ชื่อผู้ใช้งาน (Username)") },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.Person,
                                contentDescription = "Username icon"
                            )
                        },
                        singleLine = true,
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("username_input"),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Email,
                            imeAction = ImeAction.Next
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Password Input
                    OutlinedTextField(
                        value = passwordInput,
                        onValueChange = {
                            passwordInput = it
                            loginError = false
                        },
                        label = { Text("รหัสผ่าน (Password)") },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.Lock,
                                contentDescription = "Password icon"
                            )
                        },
                        trailingIcon = {
                            IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                Icon(
                                    imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                                    contentDescription = if (passwordVisible) "Hide password" else "Show password"
                                )
                            }
                        },
                        visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                        singleLine = true,
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("password_input"),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Password,
                            imeAction = ImeAction.Done
                        ),
                        keyboardActions = KeyboardActions(
                            onDone = { focusManager.clearFocus() }
                        )
                    )

                    if (loginError) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "กรุณากรอกชื่อผู้ใช้งานและรหัสผ่านให้ถูกต้อง",
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.padding(start = 4.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Login Button
                    Button(
                        onClick = {
                            focusManager.clearFocus()
                            if (usernameInput.trim().isNotEmpty() && passwordInput.trim().isNotEmpty()) {
                                val success = onLoginSuccess(usernameInput, passwordInput)
                                if (success) {
                                    Toast.makeText(context, "เข้าสู่ระบบสำเร็จ!", Toast.LENGTH_SHORT).show()
                                } else {
                                    loginError = true
                                }
                            } else {
                                loginError = true
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                            .testTag("login_button"),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Text(
                            text = "เข้าสู่ระบบ 🚀",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Quick Demo Credentials Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        1.dp,
                        MaterialTheme.colorScheme.outlineVariant,
                        RoundedCornerShape(16.dp)
                    ),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                ),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "💡 สำหรับการทดสอบ (Demo Credentials)",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold),
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(bottom = 4.dp)
                    )
                    Text(
                        text = "กรอกอะไรก็ได้เพื่อเข้าสู่ระบบ เช่น:",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "ชื่อผู้ใช้งาน: admin  |  รหัสผ่าน: password",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }
    }
}

// ==========================================
// 5. MAIN CONTAINER & NAVIGATION
// ==========================================
@Composable
fun MainNavigationContainer(viewModel: CatalogViewModel) {
    val currentTab by viewModel.currentTab.collectAsState()
    val username by viewModel.username.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val showFilterDialog by viewModel.showFilterDialog.collectAsState()
    val selectedProductForDetail by viewModel.selectedProductForDetail.collectAsState()

    val context = LocalContext.current
    val configuration = LocalConfiguration.current
    val isTablet = configuration.screenWidthDp >= 600

    // Main layout with a top Header and bottom tabs
    Scaffold(
        modifier = Modifier.fillMaxSize(),
        topBar = {
            HeaderSection(
                viewModel = viewModel,
                searchQuery = searchQuery,
                onSearchChange = { viewModel.setSearchQuery(it) },
                onFilterClick = { viewModel.setShowFilterDialog(true) },
                onAddClick = { viewModel.setTab("add") }
            )
        },
        bottomBar = {
            BottomNavigationBar(
                activeTab = currentTab,
                onTabSelect = { viewModel.setTab(it) },
                isTablet = isTablet
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MaterialTheme.colorScheme.surface.copy(alpha = 0.95f))
        ) {
            // Responsive content wrapper
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .then(
                        if (isTablet) Modifier.widthIn(max = 1000.dp).align(Alignment.TopCenter)
                        else Modifier.fillMaxSize()
                    )
            ) {
                when (currentTab) {
                    "home" -> HomeScreen(viewModel = viewModel, username = username)
                    "products" -> ProductsScreen(viewModel = viewModel)
                    "add" -> AddProductScreen(viewModel = viewModel)
                    "categories" -> CategoriesScreen(viewModel = viewModel)
                }
            }
        }
    }

    // Filter Dialog Component
    if (showFilterDialog) {
        FilterDialog(
            viewModel = viewModel,
            onDismiss = { viewModel.setShowFilterDialog(false) }
        )
    }

    // Detail Dialog Component
    selectedProductForDetail?.let { product ->
        ProductDetailDialog(
            product = product,
            onDismiss = { viewModel.setSelectedProduct(null) },
            onToggleStatus = { viewModel.toggleProductStatus(product.id) },
            onDelete = {
                viewModel.deleteProduct(product.id)
                Toast.makeText(context, "ลบสินค้าสำเร็จ", Toast.LENGTH_SHORT).show()
            }
        )
    }
}

// ==========================================
// 6. HEADER COMPOSABLE (ส่วนหัวด้านบนสุด)
// ==========================================
@Composable
fun HeaderSection(
    viewModel: CatalogViewModel,
    searchQuery: String,
    onSearchChange: (String) -> Unit,
    onFilterClick: () -> Unit,
    onAddClick: () -> Unit
) {
    val currentTab by viewModel.currentTab.collectAsState()

    Surface(
        tonalElevation = 0.dp,
        shadowElevation = 0.dp,
        color = MaterialTheme.colorScheme.background,
        modifier = Modifier
            .fillMaxWidth()
            .statusBarsPadding()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp)
        ) {
            // App Title and Welcome bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "📦",
                        fontSize = 28.sp,
                        modifier = Modifier.padding(end = 8.dp)
                    )
                    Text(
                        text = "Catalog Go",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    )
                }

                // Profile static circle badge
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.primaryContainer),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = "Profile",
                        tint = MaterialTheme.colorScheme.onPrimaryContainer,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Search Bar & Filter & Add Action Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // TextInput: Search Bar styled as a premium pill container
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = onSearchChange,
                    placeholder = { Text("Search products...", fontSize = 14.sp) },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search icon",
                            modifier = Modifier.size(20.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { onSearchChange("") }) {
                                Icon(
                                    imageVector = Icons.Default.Close,
                                    contentDescription = "Clear search",
                                    modifier = Modifier.size(16.dp),
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    },
                    singleLine = true,
                    shape = CircleShape,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = MaterialTheme.colorScheme.primary,
                        unfocusedBorderColor = MaterialTheme.colorScheme.outline,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                        focusedContainerColor = MaterialTheme.colorScheme.surface,
                        unfocusedTextColor = MaterialTheme.colorScheme.onSurface,
                        focusedTextColor = MaterialTheme.colorScheme.onSurface,
                        unfocusedPlaceholderColor = MaterialTheme.colorScheme.onSurfaceVariant,
                        focusedPlaceholderColor = MaterialTheme.colorScheme.onSurfaceVariant
                    ),
                    modifier = Modifier
                        .weight(1f)
                        .height(52.dp)
                        .testTag("search_bar_input"),
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search)
                )

                // Button: Filter (ปุ่มกดกรองสินค้า) - styled as a dark surface border box
                IconButton(
                    onClick = {
                        if (currentTab != "products") {
                            viewModel.setTab("products")
                        }
                        onFilterClick()
                    },
                    modifier = Modifier
                        .size(52.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(MaterialTheme.colorScheme.surface)
                        .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(12.dp))
                        .testTag("filter_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.FilterList,
                        contentDescription = "Filter products",
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                }
            }
        }
    }
}

// ==========================================
// 7. BOTTOM NAVIGATION COMPOSABLE
// ==========================================
@Composable
fun BottomNavigationBar(
    activeTab: String,
    onTabSelect: (String) -> Unit,
    isTablet: Boolean
) {
    Surface(
        tonalElevation = 0.dp,
        shadowElevation = 0.dp,
        color = MaterialTheme.colorScheme.surfaceVariant, // Sophisticated Dark Navigation BG (#211F26)
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            // Elegant top border matching border-[#49454F]
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(MaterialTheme.colorScheme.outline)
            )
            // Tablet view bounds bottom bar to look beautiful and not over-stretch
            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .then(if (isTablet) Modifier.width(600.dp) else Modifier.fillMaxWidth())
                    .padding(vertical = 8.dp, horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Home Tab
                BottomTabItem(
                    emoji = "🏠",
                    label = "Home",
                    isActive = activeTab == "home",
                    onClick = { onTabSelect("home") }
                )

                // Products Tab
                BottomTabItem(
                    emoji = "📦",
                    label = "Products",
                    isActive = activeTab == "products",
                    onClick = { onTabSelect("products") }
                )

                // Categories Tab
                BottomTabItem(
                    emoji = "🗂️",
                    label = "Categories",
                    isActive = activeTab == "categories",
                    onClick = { onTabSelect("categories") }
                )
            }
        }
    }
}
}

@Composable
fun BottomTabItem(
    emoji: String,
    label: String,
    isActive: Boolean,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 6.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Highlighting active tabs elegantly with a background pill
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(16.dp))
                .background(
                    if (isActive) MaterialTheme.colorScheme.primaryContainer
                    else Color.Transparent
                )
                .padding(horizontal = 14.dp, vertical = 4.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = emoji,
                fontSize = 20.sp
            )
        }
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium.copy(
                fontWeight = if (isActive) FontWeight.Bold else FontWeight.Normal,
                color = if (isActive) MaterialTheme.colorScheme.primary
                else MaterialTheme.colorScheme.onSurfaceVariant
            )
        )
    }
}

// ==========================================
// 8. HOME SCREEN COMPOSABLE
// ==========================================
@Composable
fun HomeScreen(viewModel: CatalogViewModel, username: String) {
    val products by viewModel.productList.collectAsState()
    val activeCount = products.count { it.status == "Active" }
    val categoriesSet = products.map { it.category }.toSet().size

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Beautiful Banner with dynamic vertical gradient
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(160.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(
                    Brush.linearGradient(
                        colors = listOf(
                            MaterialTheme.colorScheme.primary,
                            MaterialTheme.colorScheme.primaryContainer
                        )
                    )
                )
                .padding(20.dp),
            contentAlignment = Alignment.CenterStart
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "สวัสดี, $username! 👋",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onPrimary
                        )
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "ยินดีต้อนรับเข้าสู่ระบบจัดการและค้นหาสินค้า Catalog Go",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.85f)
                        )
                    )
                }
                Text(
                    text = "🌟",
                    fontSize = 54.sp,
                    modifier = Modifier.padding(start = 12.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Quick Stats row
        Text(
            text = "ภาพรวมคลังสินค้า",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
            color = MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.padding(bottom = 10.dp)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            StatCard(
                icon = "📦",
                title = "สินค้าทั้งหมด",
                value = products.size.toString(),
                modifier = Modifier.weight(1f),
                containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f)
            )
            StatCard(
                icon = "✅",
                title = "ใช้งานอยู่ (Active)",
                value = activeCount.toString(),
                modifier = Modifier.weight(1f),
                containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f)
            )
            StatCard(
                icon = "🗂️",
                title = "หมวดหมู่สินค้า",
                value = categoriesSet.toString(),
                modifier = Modifier.weight(1f),
                containerColor = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.4f)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Featured scroll loop section
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "รายการแนะนำ / สินค้าอัปเดตล่าสุด 👕",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                color = MaterialTheme.colorScheme.onSurface
            )
            TextButton(onClick = { viewModel.setTab("products") }) {
                Text("ดูทั้งหมด", fontWeight = FontWeight.Bold)
            }
        }

        // Horizontal loop map list
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(vertical = 4.dp)
        ) {
            items(products.take(5)) { product ->
                Card(
                    modifier = Modifier
                        .width(180.dp)
                        .clickable { viewModel.setSelectedProduct(product) },
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp)
                    ) {
                        // Product emoji on colored background
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(100.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = product.emoji, fontSize = 48.sp)
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Category Pill
                        Text(
                            text = product.category.uppercase(),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        )

                        Spacer(modifier = Modifier.height(4.dp))

                        Text(
                            text = product.name,
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )

                        Spacer(modifier = Modifier.height(4.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "฿${String.format("%,.0f", product.price)}",
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    fontWeight = FontWeight.ExtraBold,
                                    color = MaterialTheme.colorScheme.secondary
                                )
                            )

                            // Status Indicator
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(
                                        if (product.status == "Active") Color(0xFF4CAF50)
                                        else Color.Gray
                                    )
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Quick Navigation Grid
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f)
            ),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Text(
                    text = "⚡ เมนูลัดการจัดการ",
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = { viewModel.setTab("add") },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("➕ เพิ่มสินค้าใหม่", fontSize = 13.sp)
                    }

                    Button(
                        onClick = { viewModel.setTab("categories") },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("🗂️ แยกตามหมวดหมู่", fontSize = 13.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun StatCard(
    icon: String,
    title: String,
    value: String,
    modifier: Modifier = Modifier,
    containerColor: Color
) {
    Card(
        modifier = modifier.height(100.dp),
        colors = CardDefaults.cardColors(containerColor = containerColor),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.Start
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = icon, fontSize = 20.sp)
                Text(
                    text = value,
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                )
            }
            Text(
                text = title,
                style = MaterialTheme.typography.bodySmall.copy(
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.SemiBold
                ),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

// ==========================================
// 9. PRODUCTS LIST SCREEN COMPOSABLE
// ==========================================
@Composable
fun ProductsScreen(viewModel: CatalogViewModel) {
    val products by viewModel.productList.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val selectedStatus by viewModel.selectedStatus.collectAsState()

    val configuration = LocalConfiguration.current
    val gridColumnsCount = when {
        configuration.screenWidthDp >= 900 -> 4
        configuration.screenWidthDp >= 600 -> 3
        else -> 2
    }

    // Client-side mapping & filter loop
    val filteredProducts = remember(products, searchQuery, selectedCategory, selectedStatus) {
        products.filter { product ->
            val matchesQuery = product.name.contains(searchQuery, ignoreCase = true) ||
                    product.description.contains(searchQuery, ignoreCase = true)
            val matchesCategory = selectedCategory == null || product.category == selectedCategory
            val matchesStatus = selectedStatus == null || product.status == selectedStatus
            matchesQuery && matchesCategory && matchesStatus
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(14.dp)
    ) {
        // Active Filter Indicators Row
        if (selectedCategory != null || selectedStatus != null) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "ตัวกรองใช้งานอยู่:",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                selectedCategory?.let { cat ->
                    SuggestionChip(
                        onClick = { viewModel.setCategoryFilter(null) },
                        label = {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Text("หมวดหมู่: $cat", fontSize = 11.sp)
                                Icon(Icons.Default.Close, "Clear", modifier = Modifier.size(12.dp))
                            }
                        }
                    )
                }

                selectedStatus?.let { stat ->
                    SuggestionChip(
                        onClick = { viewModel.setStatusFilter(null) },
                        label = {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Text("สถานะ: $stat", fontSize = 11.sp)
                                Icon(Icons.Default.Close, "Clear", modifier = Modifier.size(12.dp))
                            }
                        }
                    )
                }
            }
        }

        if (filteredProducts.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .weight(1f),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("🔍", fontSize = 64.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "ไม่พบรายการสินค้าที่ต้องการ",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "ลองค้นหาด้วยคำอื่น หรือล้างตัวกรอง",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = {
                            viewModel.setSearchQuery("")
                            viewModel.setCategoryFilter(null)
                            viewModel.setStatusFilter(null)
                        }
                    ) {
                        Text("ล้างข้อมูลการกรองสินค้าทั้งหมด")
                    }
                }
            }
        } else {
            // Scrollable mapped product listing in adaptive grid
            LazyVerticalGrid(
                columns = GridCells.Fixed(gridColumnsCount),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier
                    .fillMaxSize()
                    .weight(1f)
            ) {
                items(filteredProducts, key = { it.id }) { product ->
                    ProductCardItem(
                        product = product,
                        onClick = { viewModel.setSelectedProduct(product) },
                        onToggleStatus = { viewModel.toggleProductStatus(product.id) }
                    )
                }
            }
        }
    }
}

// ==========================================
// 10. PRODUCT CARD ITEM
// ==========================================
@Composable
fun ProductCardItem(
    product: Product,
    onClick: () -> Unit,
    onToggleStatus: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .shadow(1.dp, shape = RoundedCornerShape(16.dp)),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            modifier = Modifier.fillMaxWidth()
        ) {
            // Large visual Emoji badge representing product
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(115.dp)
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                                MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.1f)
                            )
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(text = product.emoji, fontSize = 52.sp)

                // Quick Status Badge on top-right of image space
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(8.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(
                            if (product.status == "Active") MaterialTheme.colorScheme.primaryContainer
                            else MaterialTheme.colorScheme.outline
                        )
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .clip(CircleShape)
                                .background(
                                    if (product.status == "Active") Color(0xFF4CAF50)
                                    else Color(0xFFCAC4D0)
                                )
                        )
                        Text(
                            text = product.status.uppercase(),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (product.status == "Active") MaterialTheme.colorScheme.onPrimaryContainer
                            else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // Description info section
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp)
            ) {
                Text(
                    text = product.category,
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.SemiBold
                    ),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(2.dp))

                Text(
                    text = product.name,
                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "฿${String.format("%,.0f", product.price)}",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.secondary
                        )
                    )

                    // Minimal visual touch click area arrow
                    Icon(
                        imageVector = Icons.Default.ArrowForward,
                        contentDescription = "ดูรายละเอียด",
                        tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.6f),
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}

// ==========================================
// 11. ADD PRODUCT FORM SCREEN
// ==========================================
@Composable
fun AddProductScreen(viewModel: CatalogViewModel) {
    var name by remember { mutableStateOf("") }
    var priceStr by remember { mutableStateOf("") }
    var selectedCat by remember { mutableStateOf("Clothing") }
    var isActive by remember { mutableStateOf(true) }
    var description by remember { mutableStateOf("") }
    var selectedEmoji by remember { mutableStateOf("👕") }

    var nameError by remember { mutableStateOf(false) }
    var priceError by remember { mutableStateOf(false) }

    val context = LocalContext.current
    val focusManager = LocalFocusManager.current

    val categories = listOf("Clothing", "Shoes", "Accessories", "Electronics")
    val popularEmojis = listOf("👕", "👚", "👖", "👟", "👜", "👛", "🕶️", "🎧", "⌚", "💻", "📱", "📦", "🏃")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(18.dp)
    ) {
        Text(
            text = "➕ เพิ่มสินค้าใหม่เข้าระบบ",
            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        Card(
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(20.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(18.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Emoji Selector Row
                Column {
                    Text(
                        text = "เลือกไอคอนตัวแทนสินค้า (Emoji)",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Current Selected Emoji Preview
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(MaterialTheme.colorScheme.primaryContainer),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = selectedEmoji, fontSize = 32.sp)
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        // Horizontal loop selector of popular emojis
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            items(popularEmojis) { emoji ->
                                Box(
                                    modifier = Modifier
                                        .size(40.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(
                                            if (selectedEmoji == emoji) MaterialTheme.colorScheme.secondaryContainer
                                            else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                                        )
                                        .clickable { selectedEmoji = emoji }
                                        .padding(4.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(text = emoji, fontSize = 20.sp)
                                }
                            }
                        }
                    }
                }

                // Product Name Field
                Column {
                    OutlinedTextField(
                        value = name,
                        onValueChange = {
                            name = it
                            nameError = false
                        },
                        label = { Text("ชื่อสินค้า (Product Name) *") },
                        placeholder = { Text("เช่น Unisex T-Shirt White") },
                        singleLine = true,
                        isError = nameError,
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("add_product_name_input"),
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next)
                    )
                    if (nameError) {
                        Text(
                            text = "กรุณากรอกชื่อสินค้าให้ถูกต้อง",
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.padding(start = 4.dp, top = 2.dp)
                        )
                    }
                }

                // Price Field
                Column {
                    OutlinedTextField(
                        value = priceStr,
                        onValueChange = {
                            priceStr = it
                            priceError = false
                        },
                        label = { Text("ราคา (Price - บาท) *") },
                        placeholder = { Text("เช่น 350") },
                        leadingIcon = { Text("฿", fontWeight = FontWeight.Bold, modifier = Modifier.padding(start = 8.dp)) },
                        singleLine = true,
                        isError = priceError,
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("add_product_price_input"),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Number,
                            imeAction = ImeAction.Next
                        )
                    )
                    if (priceError) {
                        Text(
                            text = "กรุณากรอกเฉพาะตัวเลขจำนวนเงินให้ถูกต้อง",
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.padding(start = 4.dp, top = 2.dp)
                        )
                    }
                }

                // Category selection using Row mapping
                Column {
                    Text(
                        text = "หมวดหมู่สินค้า (Category)",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(bottom = 6.dp)
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        categories.forEach { cat ->
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(
                                        if (selectedCat == cat) MaterialTheme.colorScheme.primaryContainer
                                        else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                                    )
                                    .border(
                                        1.dp,
                                        if (selectedCat == cat) MaterialTheme.colorScheme.primary
                                        else Color.Transparent,
                                        RoundedCornerShape(10.dp)
                                    )
                                    .clickable { selectedCat = cat }
                                    .padding(vertical = 10.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = when (cat) {
                                        "Clothing" -> "👕 เสื้อผ้า"
                                        "Shoes" -> "👟 รองเท้า"
                                        "Accessories" -> "👜 ทั่วไป"
                                        "Electronics" -> "💻 ไอที"
                                        else -> cat
                                    },
                                    fontSize = 11.sp,
                                    fontWeight = if (selectedCat == cat) FontWeight.Bold else FontWeight.Normal,
                                    color = if (selectedCat == cat) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
                                )
                            }
                        }
                    }
                }

                // Status Switch
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
                        .padding(horizontal = 14.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "สถานะการขายสินค้า",
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.bodyMedium
                        )
                        Text(
                            text = if (isActive) "พร้อมวางจำหน่าย (Active)" else "ปิดการขายชั่วคราว (Inactive)",
                            fontSize = 12.sp,
                            color = if (isActive) Color(0xFF2E7D32) else Color.Gray
                        )
                    }

                    Switch(
                        checked = isActive,
                        onCheckedChange = { isActive = it }
                    )
                }

                // Description Field
                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("รายละเอียดสินค้า (Description)") },
                    placeholder = { Text("กรอกรายละเอียดหรือจุดเด่นสินค้า...") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp),
                    maxLines = 4,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                    keyboardActions = KeyboardActions(onDone = { focusManager.clearFocus() })
                )

                Spacer(modifier = Modifier.height(4.dp))

                // Submit Save Button
                Button(
                    onClick = {
                        focusManager.clearFocus()
                        val validName = name.trim().isNotEmpty()
                        val parsedPrice = priceStr.trim().toDoubleOrNull()
                        val validPrice = parsedPrice != null && parsedPrice >= 0

                        if (!validName) nameError = true
                        if (!validPrice) priceError = true

                        if (validName && validPrice) {
                            viewModel.addProduct(
                                name = name.trim(),
                                price = parsedPrice!!,
                                category = selectedCat,
                                status = if (isActive) "Active" else "Inactive",
                                emoji = selectedEmoji,
                                description = description.trim()
                            )
                            Toast.makeText(context, "บันทึกข้อมูลสินค้าเรียบร้อย!", Toast.LENGTH_SHORT).show()
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .testTag("save_product_button"),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = "💾 บันทึกข้อมูลและวางจำหน่าย",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

// ==========================================
// 12. CATEGORIES GRID SCREEN COMPOSABLE
// ==========================================
@Composable
fun CategoriesScreen(viewModel: CatalogViewModel) {
    val products by viewModel.productList.collectAsState()

    val categoriesMap = mapOf(
        "Clothing" to Pair("👕", "หมวดหมู่เสื้อผ้าและแฟชั่นสำหรับทุกเพศ"),
        "Shoes" to Pair("👟", "รองเท้าผ้าใบ รองเท้าวิ่ง และรองเท้าคลาสสิก"),
        "Accessories" to Pair("👜", "กระเป๋าถือ กระเป๋าสตางค์ และเครื่องประดับ"),
        "Electronics" to Pair("💻", "หูฟังบลูทูธ สมาร์ทวอทช์ และอุปกรณ์ไอที")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(18.dp)
    ) {
        Text(
            text = "🗂️ แยกตามประเภทสินค้า",
            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 4.dp)
        )
        Text(
            text = "เลือกหมวดหมู่ที่ต้องการ เพื่อกรองข้อมูลแคตตาล็อกสินค้าด่วน",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // Map loop scroll view equivalent in Kotlin
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(categoriesMap.keys.toList()) { key ->
                val details = categoriesMap[key]!!
                val itemCount = products.count { it.category == key }

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            viewModel.setCategoryFilter(key)
                            viewModel.setTab("products")
                        },
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Large visual category circle
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = details.first, fontSize = 28.sp)
                        }

                        Spacer(modifier = Modifier.width(16.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = when (key) {
                                    "Clothing" -> "เสื้อผ้า (Clothing)"
                                    "Shoes" -> "รองเท้า (Shoes)"
                                    "Accessories" -> "ทั่วไป (Accessories)"
                                    "Electronics" -> "อุปกรณ์ไอที (Electronics)"
                                    else -> key
                                },
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = details.second,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }

                        // Count pill
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(MaterialTheme.colorScheme.primary)
                                .padding(horizontal = 10.dp, vertical = 4.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "$itemCount ชิ้น",
                                color = MaterialTheme.colorScheme.onPrimary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 13. FILTER DIALOG COMPONENT
// ==========================================
@Composable
fun FilterDialog(viewModel: CatalogViewModel, onDismiss: () -> Unit) {
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val selectedStatus by viewModel.selectedStatus.collectAsState()

    var tempCategory by remember { mutableStateOf(selectedCategory) }
    var tempStatus by remember { mutableStateOf(selectedStatus) }

    val categories = listOf("Clothing", "Shoes", "Accessories", "Electronics")
    val statuses = listOf("Active", "Inactive")

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "🧪 กรองข้อมูลสินค้า",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, "Close")
                    }
                }

                Divider()

                // Filter by Category
                Column {
                    Text(
                        text = "หมวดหมู่สินค้า",
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        // All button
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(
                                    if (tempCategory == null) MaterialTheme.colorScheme.primaryContainer
                                    else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                                )
                                .clickable { tempCategory = null }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                "ทั้งหมด",
                                fontSize = 11.sp,
                                fontWeight = if (tempCategory == null) FontWeight.Bold else FontWeight.Normal
                            )
                        }

                        categories.forEach { cat ->
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(
                                        if (tempCategory == cat) MaterialTheme.colorScheme.primaryContainer
                                        else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                                    )
                                    .clickable { tempCategory = cat }
                                    .padding(vertical = 8.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = when (cat) {
                                        "Clothing" -> "👕 เสื้อ"
                                        "Shoes" -> "👟 รองเท้า"
                                        "Accessories" -> "👜 ทั่วไป"
                                        "Electronics" -> "💻 ไอที"
                                        else -> cat
                                    },
                                    fontSize = 11.sp,
                                    fontWeight = if (tempCategory == cat) FontWeight.Bold else FontWeight.Normal
                                )
                            }
                        }
                    }
                }

                // Filter by Status
                Column {
                    Text(
                        text = "สถานะสินค้า",
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // All button
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(
                                    if (tempStatus == null) MaterialTheme.colorScheme.primaryContainer
                                    else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                                )
                                .clickable { tempStatus = null }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                "ทั้งหมด",
                                fontSize = 12.sp,
                                fontWeight = if (tempStatus == null) FontWeight.Bold else FontWeight.Normal
                            )
                        }

                        statuses.forEach { stat ->
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(
                                        if (tempStatus == stat) MaterialTheme.colorScheme.primaryContainer
                                        else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                                    )
                                    .clickable { tempStatus = stat }
                                    .padding(vertical = 8.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = if (stat == "Active") "Active (ปกติ)" else "Inactive (ปิด)",
                                    fontSize = 11.sp,
                                    fontWeight = if (tempStatus == stat) FontWeight.Bold else FontWeight.Normal
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))

                // Actions
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = {
                            viewModel.setCategoryFilter(null)
                            viewModel.setStatusFilter(null)
                            onDismiss()
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("ล้างตัวกรอง", fontSize = 13.sp)
                    }

                    Button(
                        onClick = {
                            viewModel.setCategoryFilter(tempCategory)
                            viewModel.setStatusFilter(tempStatus)
                            onDismiss()
                        },
                        modifier = Modifier.weight(1.5f),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("ตกลง / กรองสินค้า", fontSize = 13.sp)
                    }
                }
            }
        }
    }
}

// ==========================================
// 14. PRODUCT DETAILS DIALOG COMPONENT
// ==========================================
@Composable
fun ProductDetailDialog(
    product: Product,
    onDismiss: () -> Unit,
    onToggleStatus: () -> Unit,
    onDelete: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, "Close")
                    }
                }

                // Large emoji visual
                Box(
                    modifier = Modifier
                        .size(100.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = product.emoji, fontSize = 54.sp)
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Category pill
                Text(
                    text = product.category.uppercase(),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.6f))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Product Name
                Text(
                    text = product.name,
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(6.dp))

                // Price display
                Text(
                    text = "฿${String.format("%,.2f", product.price)}",
                    style = MaterialTheme.typography.headlineSmall.copy(
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.secondary
                    )
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Status Badge Row
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
                        .padding(horizontal = 14.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(
                                if (product.status == "Active") Color(0xFF4CAF50)
                                else Color.Gray
                            )
                    )
                    Text(
                        text = "สถานะ: ${product.status}",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                        color = if (product.status == "Active") Color(0xFF2E7D32) else Color.Gray
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Description Title
                Text(
                    text = "รายละเอียดสินค้า:",
                    modifier = Modifier.fillMaxWidth(),
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(modifier = Modifier.height(4.dp))

                // Description Text
                Text(
                    text = product.description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Actions row
                Button(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("ปิดหน้านี้", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
