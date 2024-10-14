import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface CompanyState {
  companyData: any[];
  filteredCompanyData: any[];
  currentCompany: any | null;
  loading: boolean;
  error: string | null;
  pendingCompanyCreate: boolean;
  pendingCompanyUpdate: boolean;
  addCompanyError: string | null;
  updateCompanyError: string | null;
}

const initialState: CompanyState = {
  companyData: [],
  filteredCompanyData: [],
  currentCompany: null,
  loading: false,
  error: null,
  pendingCompanyCreate: false,
  pendingCompanyUpdate: false,
  addCompanyError: null,
  updateCompanyError: null,
};

interface CompanyDataType {
  name: string;
  desc: string;
  ctc_lpa: number;
  base_inr: number;
  roles: string[];
  criteria: string;
  logoUrl: string;
  website: string;
  location: string;
  categories: string[];
  id: string;
}

interface InputCompanyDataType
  extends Omit<CompanyDataType, "roles" | "categories"> {
  roles: string;
  categories: string;
}

export const fetchCompanyData = createAsyncThunk(
  "company/fetchCompanyData",
  async (token: string) => {
    const response = await fetch("/api/companies", {
      headers: {
        Authorization: token,
      },
    });
    const data = await response.json();
    return data;
  }
);

export const addCompany = createAsyncThunk(
  "company/addCompany",
  async ({ token, companyData }: { token: string; companyData: any }) => {
    const response = await fetch("/api/companies/add", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ ...companyData, token }),
    });

    const data = await response.json();
    return data;
  }
);

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({
    token,
    companyData,
  }: {
    token: string;
    companyData: InputCompanyDataType;
  }) => {
    const response = await fetch(`/api/companies/update/${companyData.id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ ...companyData, token }),
    });

    const data = await response.json();
    return data;
  }
);

const filterCompanies = (
  companies: CompanyDataType[],
  searchText: string
): CompanyDataType[] => {
  if (!searchText) return companies;
  const afterFilter = companies.filter((company) => {
    return company.name.toLowerCase().includes(searchText.toLowerCase());
  });

  return afterFilter;
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompanyData(state, action: PayloadAction<any[]>) {
      state.companyData = action.payload;
    },
    setCurrentCompany(state, action: PayloadAction<any>) {
      state.currentCompany = action.payload;
    },
    filterCompaniesBySearch(state, action: PayloadAction<string>) {
      const searchText = action.payload;
      state.filteredCompanyData = filterCompanies(
        state.companyData,
        searchText
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Companies
      .addCase(fetchCompanyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCompanyData.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.companyData = action.payload;
          state.filteredCompanyData = action.payload;
        }
      )
      .addCase(fetchCompanyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch company data.";
      })

      // Add Company
      .addCase(addCompany.pending, (state) => {
        state.pendingCompanyCreate = true;
        state.addCompanyError = null;
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.pendingCompanyCreate = false;
        const companyData = [action.payload, ...state.companyData];
        state.companyData = companyData;
        const searchText = state.filteredCompanyData[0].name;
        state.filteredCompanyData = filterCompanies(companyData, searchText);
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.pendingCompanyCreate = false;
        state.addCompanyError =
          action.error.message || "Failed to add company.";
      })

      // Update Company
      .addCase(updateCompany.pending, (state) => {
        state.pendingCompanyUpdate = true;
        state.updateCompanyError = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.pendingCompanyUpdate = false;
        const updatedCompany = action.payload;
        const companyIndex = state.companyData.findIndex(
          (company) => company.id === updatedCompany.id
        );
        state.companyData[companyIndex] = updatedCompany;
        const filteredCompanyIndex = state.filteredCompanyData.findIndex(
          (company) => company.id === updatedCompany.id
        );
        if (filteredCompanyIndex !== -1) {
          state.filteredCompanyData[filteredCompanyIndex] = updatedCompany;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.pendingCompanyUpdate = false;
        state.updateCompanyError =
          action.error.message || "Failed to update company.";
      });
  },
});

export const { setCompanyData, setCurrentCompany, filterCompaniesBySearch } =
  companySlice.actions;
export default companySlice.reducer;
