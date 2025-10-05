export declare enum SupplierStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class CreateSupplierDto {
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    contactPerson?: string;
    contactPhone?: string;
    contactEmail?: string;
    website?: string;
    paymentTerms?: string;
    taxId?: string;
    certifications?: string;
    status?: SupplierStatus;
}
