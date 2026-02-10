// Quick shim to silence editor errors when @types/react isn't installed.
// Prefer installing real types with: npm i -D @types/react @types/react-dom
declare module 'react/jsx-runtime';

declare module 'react' {
	export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
	export function useEffect(effect: (...args: any[]) => any, deps?: any[]): void;
	export function useRef<T = any>(initial?: T | null): { current: T | null };
	export function useMemo<T>(factory: () => T, deps?: any[]): T;
	export function useCallback<T extends (...args: any[]) => any>(cb: T, deps?: any[]): T;
	export function useContext<T = any>(context: any): T;
	export const Fragment: any;
	export const Children: any;
}

// Minimal JSX and React ambient types so the editor/TS server can understand JSX.
declare namespace React {
	type ReactNode = any;
	type FormEvent<T = any> = any;
	type FormEventHandler<T = any> = (e: any) => void;
}

declare namespace JSX {
	interface IntrinsicElements {
		[elemName: string]: any;
	}
	interface Element {}
	interface ElementClass {}
}
