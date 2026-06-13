import axios from 'axios';

const api = axios.create({
  baseURL: 'https://subnetmagic-01.onrender.com',
});

export const API_CONNECTION_ERROR = 'API connection failed. Verify FastAPI server is running on port 8001.';

export interface SubnetBlock {
  start: number;
  end: number;
  label: string;
  is_active: boolean;
}

export interface SubnetResult {
  ip: string;
  cidr: number;
  subnet_mask: string;
  magic_number: number;
  network_id: string;
  broadcast: string;
  host_count: number;
  usable_hosts: number;
  usable_range: string;
  first_host: string;
  last_host: string;
  steps: string[];
  blocks: SubnetBlock[];
  highlight_octet: number;
}

export interface WildcardResult {
  subnet_mask: string;
  wildcard: string;
  steps: string[];
}

export interface VLSMAllocation {
  network: string;
  cidr: number;
  subnet_mask: string;
  hosts_required: number;
  usable_hosts: number;
  network_id: string;
  broadcast: string;
  usable_range: string;
}

export interface VLSMResult {
  base_network: string;
  allocations: VLSMAllocation[];
  steps: string[];
}

export interface QuizQuestion {
  id: string;
  difficulty: string;
  question: string;
  options: string[];
  answer: string;
  explanation: {
    magic_number: number;
    block?: string;
    network_id: string;
    broadcast: string;
    usable_range: string;
    host_count: number;
    note?: string;
  };
}

export const calculateSubnet = (ip: string, cidr: number) =>
  api.post<SubnetResult>('/api/subnet', { ip, cidr });

export const calculateWildcard = (mask: string) =>
  api.post<WildcardResult>('/api/wildcard', { mask });

export const calculateVLSM = (network: string, hosts: number[]) =>
  api.post<VLSMResult>('/api/vlsm', { network, hosts });

export const getQuizQuestion = () => api.get<QuizQuestion>('/api/quiz');

export default api;
