// Categories
export { useCategoriesStore } from "./use-categories";
export type {
  AdminCategory,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/services/admin";

// Customization Types
export { useCustomizationTypesStore } from "./use-customization-types";
export type {
  CustomizationType,
  CreateCustomizationTypeData,
  UpdateCustomizationTypeData,
} from "@/services/admin";

// Customization Options
export { useCustomizationOptionsStore } from "./use-customization-options";
export type {
  CustomizationOption,
  CreateCustomizationOptionData,
  UpdateCustomizationOptionData,
} from "@/services/admin";

// Users
export { useUsers } from "./use-users";
export type { UserStore } from "./use-users";

// Products
export { useProductsStore } from "./use-products";
export type {
  AdminProduct,
  CreateProductData,
  UpdateProductData,
} from "@/services/admin";
