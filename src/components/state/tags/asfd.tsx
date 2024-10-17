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

export const useAsideBarOpen: any = create()(zukeeper((set: any) => ({
  isOpen: false,
  setIsOpen: () => set((state: any) => ({ isOpen: !state.isOpen })),
})))

export const useUserSession: any = create()(zukeeper((set: any) => ({
  user: null,
  setUser: (user: any) => set(() => ({ user })),
})))

window.Storage = useTagsStore;
