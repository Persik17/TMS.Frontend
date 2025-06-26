interface CompanyViewModel {
  id: string;
  name: string;
  logo?: string;
  inn: string;
  ogrn: string;
  address: string;
  website?: string;
  industry?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  ceoSummary: CeoSummary;
  tariffSummary: TariffSummary;
}
