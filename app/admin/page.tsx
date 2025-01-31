"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useProductsStore } from "@/lib/store/products"
import { Product } from "@/lib/types"
import { Trash2, Edit, Plus, Search, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCategoriesStore } from "@/lib/store/categories"
import { useManufacturersStore } from "@/lib/store/manufacturers"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

const DEFAULT_PLACEHOLDER = 'https://res.cloudinary.com/dsivz1t7t/image/upload/v1/autoparts/placeholder-image';

export default function AdminPage() {
  const router = useRouter()
  const { products, updateProduct, deleteProduct, addProduct } = useProductsStore()
  const { categories, addCategory, deleteCategory } = useCategoriesStore()
  const { manufacturers, addManufacturer, deleteManufacturer } = useManufacturersStore()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteDialogProduct, setDeleteDialogProduct] = useState<Product | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)
  const [newManufacturer, setNewManufacturer] = useState("")
  const [deletingManufacturer, setDeletingManufacturer] = useState<string | null>(null)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [productSearch, setProductSearch] = useState("")
  const [categorySearch, setCategorySearch] = useState("")
  const [manufacturerSearch, setManufacturerSearch] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAdminAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
      toast.error("Please login as admin")
    }
  }, [router])

  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = (updatedProduct: Product) => {
    updateProduct(updatedProduct.id, updatedProduct)
    setIsEditDialogOpen(false)
    setEditingProduct(null)
    toast.success("Product updated successfully")
  }

  const handleDeleteClick = (product: Product) => {
    setDeleteDialogProduct(product)
  }

  const handleConfirmDelete = () => {
    if (deleteDialogProduct) {
      deleteProduct(deleteDialogProduct.id)
      toast.success("Product deleted successfully")
      setDeleteDialogProduct(null)
    }
  }

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name")
      return
    }

    if (categories.includes(newCategory.trim())) {
      toast.error("Category already exists")
      return
    }

    addCategory(newCategory.trim())
    setNewCategory("")
    toast.success("Category added successfully")
  }

  const handleDeleteCategory = (category: string) => {
    setDeletingCategory(category)
  }

  const handleConfirmCategoryDelete = () => {
    if (deletingCategory) {
      // Check if any products are using this category
      const productsUsingCategory = products.filter(
        product => product.category === deletingCategory
      )

      if (productsUsingCategory.length > 0) {
        toast.error(`Cannot delete category. ${productsUsingCategory.length} products are using it.`)
        setDeletingCategory(null)
        return
      }

      deleteCategory(deletingCategory)
      toast.success("Category deleted successfully")
      setDeletingCategory(null)
    }
  }

  const handleAddManufacturer = () => {
    if (!newManufacturer.trim()) {
      toast.error("Please enter a manufacturer name")
      return
    }

    if (manufacturers.includes(newManufacturer.trim())) {
      toast.error("Manufacturer already exists")
      return
    }

    addManufacturer(newManufacturer.trim())
    setNewManufacturer("")
    toast.success("Manufacturer added successfully")
  }

  const handleDeleteManufacturer = (manufacturer: string) => {
    setDeletingManufacturer(manufacturer)
  }

  const handleConfirmManufacturerDelete = () => {
    if (deletingManufacturer) {
      // Check if any products are using this manufacturer
      const productsUsingManufacturer = products.filter(
        product => product.manufacturer === deletingManufacturer
      )

      if (productsUsingManufacturer.length > 0) {
        toast.error(`Cannot delete manufacturer. ${productsUsingManufacturer.length} products are using it.`)
        setDeletingManufacturer(null)
        return
      }

      deleteManufacturer(deletingManufacturer)
      toast.success("Manufacturer deleted successfully")
      setDeletingManufacturer(null)
    }
  }

  // Filter functions
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.partNumber.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.manufacturer.toLowerCase().includes(productSearch.toLowerCase())
  )

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const filteredManufacturers = manufacturers.filter(manufacturer =>
    manufacturer.toLowerCase().includes(manufacturerSearch.toLowerCase())
  )

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setUploading(true);
    const file = e.target.files[0];
    
    // Validate file size
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size too large. Please upload an image under 10MB');
      setUploading(false);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload image');
        }

        if (data.url) {
          setImageUrl(data.url);
          toast.success('Image uploaded successfully');
        } else {
          throw new Error('No URL received from server');
        }
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Invalid server response');
      }
    } catch (error: unknown) {
      console.error('Error uploading image:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to upload image');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct({
      id: crypto.randomUUID(),
      name: '',
      partNumber: '',
      price: 0,
      category: '',
      manufacturer: '',
      description: '',
      image: DEFAULT_PLACEHOLDER,
      inStock: true,
      quantity: 0
    })
    setIsCreating(true)
    setIsEditDialogOpen(true)
  }

  const EditDialog = () => {
    const [name, setName] = useState(editingProduct?.name || '')
    const [price, setPrice] = useState(editingProduct?.price.toString() || '')
    const [category, setCategory] = useState(editingProduct?.category || '')
    const [partNumber, setPartNumber] = useState(editingProduct?.partNumber || '')
    const [manufacturer, setManufacturer] = useState(editingProduct?.manufacturer || '')
    const [description, setDescription] = useState(editingProduct?.description || '')
    const [inStock, setInStock] = useState(editingProduct?.inStock ?? true)
    const [quantity, setQuantity] = useState(editingProduct?.quantity?.toString() ?? '')
    const { categories } = useCategoriesStore()
    const { manufacturers } = useManufacturersStore()
    const { addProduct } = useProductsStore()

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!editingProduct) return

      const updatedProduct: Product = {
        ...editingProduct,
        name: name.trim(),
        price: parseFloat(price),
        category: category.trim(),
        partNumber: partNumber.trim(),
        manufacturer: manufacturer.trim(),
        inStock: inStock,
        quantity: quantity === '' ? 0 : parseInt(quantity.toString()),
        description: description.trim() || `Description for ${name.trim()}`,
        image: imageUrl || editingProduct.image,
      }

      if (imageUrl) {
        updatedProduct.imageUrl = imageUrl
      }

      if (isCreating) {
        addProduct(updatedProduct)
        toast.success("Product created successfully")
      } else {
        handleSaveEdit(updatedProduct)
      }

      setIsEditDialogOpen(false)
      setEditingProduct(null)
      setIsCreating(false)
      setImageUrl("")
    }

    return (
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsEditDialogOpen(false)
          setEditingProduct(null)
          setIsCreating(false)
          setImageUrl("")
        }
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[90vw] w-full md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Create Product' : 'Edit Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">Product Image</label>
              <div className="flex items-center gap-4">
                <img 
                  src={imageUrl || editingProduct?.image || DEFAULT_PLACEHOLDER}
                  alt="Product preview" 
                  className="h-32 w-32 object-cover rounded-md"
                />
                <div className="flex-1">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                    disabled={uploading}
                  />
                  {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Part Number</label>
              <Input
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                className="w-full p-2 border rounded-md"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Manufacturer</label>
              <select
                className="w-full p-2 border rounded-md"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
              >
                <option value="">Select a manufacturer</option>
                {manufacturers.map((mfr) => (
                  <option key={mfr} value={mfr}>
                    {mfr}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity in Stock</label>
              <Input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value
                  setQuantity(value)
                  setInStock(value !== '' && parseInt(value) > 0)
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => {
                  setInStock(e.target.checked)
                  if (!e.target.checked) setQuantity('')
                }}
                id="inStock"
              />
              <label htmlFor="inStock" className="text-sm font-medium">
                In Stock
              </label>
            </div>
            <Button className="w-full" onClick={handleSubmit}>
              {isCreating ? 'Create Product' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button 
          variant="destructive" 
          onClick={() => {
            localStorage.removeItem("isAdminAuthenticated")
            router.push("/")
          }}
        >
          Logout
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Catalog Management Collapsible */}
        <Collapsible open={catalogOpen} onOpenChange={setCatalogOpen}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <div className="p-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Catalog Management</h2>
                {catalogOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6">
                <Tabs defaultValue="categories">
                  <TabsList className="mb-4">
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="manufacturers">Manufacturers</TabsTrigger>
                  </TabsList>

                  <TabsContent value="categories">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Search categories..."
                              value={categorySearch}
                              onChange={(e) => setCategorySearch(e.target.value)}
                              className="pl-10 pr-10"
                            />
                            {categorySearch && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent"
                                onClick={() => setCategorySearch("")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <Input
                          placeholder="New category name"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <Button onClick={handleAddCategory}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category Name</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCategories.map((category) => (
                            <TableRow key={category}>
                              <TableCell>{category}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteCategory(category)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="manufacturers">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Search manufacturers..."
                              value={manufacturerSearch}
                              onChange={(e) => setManufacturerSearch(e.target.value)}
                              className="pl-10 pr-10"
                            />
                            {manufacturerSearch && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent"
                                onClick={() => setManufacturerSearch("")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <Input
                          placeholder="New manufacturer name"
                          value={newManufacturer}
                          onChange={(e) => setNewManufacturer(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddManufacturer()}
                        />
                        <Button onClick={handleAddManufacturer}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Manufacturer Name</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredManufacturers.map((manufacturer) => (
                            <TableRow key={manufacturer}>
                              <TableCell>{manufacturer}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteManufacturer(manufacturer)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Products Management Collapsible */}
        <Collapsible open={productsOpen} onOpenChange={setProductsOpen}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <div className="p-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Products Management</h2>
                {productsOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6">
                <div className="mb-4 flex justify-between items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    {productSearch && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent"
                        onClick={() => setProductSearch("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button onClick={handleCreateProduct} className="ml-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Part Number</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead>Stock Status</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.partNumber}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.manufacturer}</TableCell>
                        <TableCell className="text-right">
                          ${product.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.quantity}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditClick(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteClick(product)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      <EditDialog />

      <AlertDialog 
        open={deleteDialogProduct !== null} 
        onOpenChange={(open) => !open && setDeleteDialogProduct(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deleteDialogProduct?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Category Delete Confirmation Dialog */}
      <AlertDialog 
        open={deletingCategory !== null} 
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{deletingCategory}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmCategoryDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Manufacturer Delete Confirmation Dialog */}
      <AlertDialog 
        open={deletingManufacturer !== null} 
        onOpenChange={(open) => !open && setDeletingManufacturer(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the manufacturer "{deletingManufacturer}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmManufacturerDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 