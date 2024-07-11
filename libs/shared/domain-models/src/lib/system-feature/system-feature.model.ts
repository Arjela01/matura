export interface SystemFeatureModel {
  name?: string;
  isAvailable?: boolean;
  availableFrom?: any;
  availableTo?: any;
  id?: number;
}

export interface SystemFeatView {
  data: SystemFeatureModel[];
}
