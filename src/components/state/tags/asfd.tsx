import { create } from 'zustand'
import type { Option } from "@/components/ui/multiple-selector";
import zukeeper from 'zukeeper';

interface tagsState {
  tags: Option[]
  setTags: (tags: Option[]) => void
}

export const useTagsStore: any = create<tagsState>()(zukeeper((set: any) => ({
  tags: [],
  setTags: (tags: Option[]) => set(() => ({ tags })),
})))

window.Storage = useTagsStore;
