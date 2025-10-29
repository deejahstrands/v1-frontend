export { categoryService } from './category.service';
export type { 
  AdminCategory, 
  CreateCategoryData, 
  UpdateCategoryData,
  CategoryResponse,
  CategoriesResponse
} from './category.service';

export { customizationTypeService } from './customization-type.service';
export type {
  CustomizationType,
  CreateCustomizationTypeData,
  UpdateCustomizationTypeData,
  CustomizationTypeResponse,
  CustomizationTypesResponse
} from './customization-type.service';

export { customizationOptionService } from './customization-option.service';
export type {
  CustomizationOption,
  CreateCustomizationOptionData,
  UpdateCustomizationOptionData,
  CustomizationOptionResponse,
  CustomizationOptionsResponse
} from './customization-option.service';

export { productService } from './product.service';
export type {
  AdminProduct,
  CreateProductData,
  UpdateProductData,
  ProductResponse,
  ProductsResponse
} from './product.service';

export { fittingService } from './fitting.service';
export type {
  PrivateFitting,
  CreateFittingData,
  UpdateFittingData,
  FittingResponse,
  FittingsResponse
} from './fitting.service';

export { processingTimeService } from './processing-time.service';
export type {
  ProcessingTime,
  CreateProcessingTimeData,
  UpdateProcessingTimeData,
  ProcessingTimeResponse,
  ProcessingTimesResponse
} from './processing-time.service';

export { wigUnitService } from './wig-unit.service';
export type {
  WigUnit,
  WigUnitCustomization,
  WigUnitCustomizationOption,
  CreateWigUnitData,
  UpdateWigUnitData,
  WigUnitsResponse,
  WigUnitResponse,
  DeleteWigUnitResponse
} from './wig-unit.service';

export { consultationTypeService } from './consultation-type.service';
export type {
  ConsultationType,
  CreateConsultationTypeData,
  UpdateConsultationTypeData,
  ConsultationTypesResponse,
  ConsultationTypeResponse,
  DeleteConsultationTypeResponse
} from './consultation-type.service';

export { overviewService } from './overview.service';
export type {
  OverviewData,
  OverviewResponse
} from './overview.service';

//export { userService } from './user.service';
//export { orderService } from './order.service';
//export { consultationService } from './consultation.service';
