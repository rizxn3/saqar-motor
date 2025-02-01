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
  DialogDescription,
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
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { ImageUpload } from "@/components/ui/image-upload"

const DEFAULT_PLACEHOLDER = 'https://placehold.co/300x300/gray/white?text=No+Image';

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
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
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

  const deleteImageFromSupabase = async (imageUrl: string) => {
    try {
      // Extract the file path from the URL
      const filePathMatch = imageUrl.match(/product-images\/(.*)/);
      if (!filePathMatch) {
        console.error('Could not extract file path from URL:', imageUrl);
        return;
      }
      
      const filePath = filePathMatch[1];
      const { error } = await supabase.storage
        .from('product-images')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image from Supabase:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image from storage');
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogProduct) {
      try {
        // Only attempt to delete if it's not the placeholder image
        if (deleteDialogProduct.image && 
            deleteDialogProduct.image !== DEFAULT_PLACEHOLDER && 
            deleteDialogProduct.image.includes('supabase')) {
          await deleteImageFromSupabase(deleteDialogProduct.image);
        }
        
        // Delete the product from your store
        deleteProduct(deleteDialogProduct.id);
        toast.success("Product deleted successfully");
      } catch (error) {
        console.error('Error during product deletion:', error);
        toast.error("Failed to delete product completely");
      } finally {
        setDeleteDialogProduct(null);
      }
    }
  };

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

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        const imageUrl = await handleImageUpload(file);
        if (imageUrl) {
          setNewProduct(prev => ({ ...prev, image: imageUrl }));
          if (editingProduct) {
            setEditingProduct(prev => prev ? { ...prev, image: imageUrl } : null);
          }
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
      } finally {
        setUploading(false);
      }
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
            <DialogDescription>
              {isCreating 
                ? 'Add a new product to your inventory' 
                : 'Make changes to your product here'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Image</label>
              <ImageUpload
                currentImage={imageUrl || editingProduct?.image || DEFAULT_PLACEHOLDER}
                onImageUpload={async (file) => {
                  try {
                    setUploading(true);
                    const imageUrl = await handleImageUpload(file);
                    if (imageUrl) {
                      setNewProduct(prev => ({ ...prev, image: imageUrl }));
                      if (editingProduct) {
                        setEditingProduct(prev => prev ? { ...prev, image: imageUrl } : null);
                      }
                      setImageUrl(imageUrl);
                    }
                  } catch (error) {
                    console.error('Upload error:', error);
                    toast.error('Failed to upload image');
                  } finally {
                    setUploading(false);
                  }
                }}
                isUploading={uploading}
              />
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
    <div className="container mx-auto p-3 md:p-6 space-y-4">
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

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-2 md:items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateProduct} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
          
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="hidden md:table-cell">Part Number</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={product.image || DEFAULT_PLACEHOLDER}
                          alt={product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.partNumber}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(product)}
                          className="text-destructive hover:text-destructive"
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
        </TabsContent>
        
        <TabsContent value="catalog" className="space-y-4">
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