import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle, ShieldCheck, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by Venture Mind ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0C0E17] text-stone-100 p-6 selection:bg-amber-500/30 selection:text-amber-200">
          <div className="max-w-xl w-full p-8 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-2xl text-center space-y-6 relative overflow-hidden backdrop-blur-xl">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-amber-500/10 text-amber-400 border border-amber-400/20">
                Venture Mind Executive Shield
              </span>
              <h1 className="text-2xl font-bold font-heading text-stone-100">
                Une erreur inattendue est survenue
              </h1>
              <p className="text-xs text-stone-400 leading-relaxed max-w-md mx-auto">
                L'application a intercepté une interruption de rendu. Vous pouvez recharger l'application ou réinitialiser le cache local pour restaurer un état stable.
              </p>
            </div>

            {/* Error details preview (sanitized) */}
            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 text-left font-mono text-[11px] text-rose-300 max-h-32 overflow-y-auto">
                <div className="font-bold text-rose-400 mb-1">
                  {this.state.error.name}: {this.state.error.message}
                </div>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-stone-500 whitespace-pre-wrap leading-tight">
                    {this.state.error.stack.split('\n').slice(0, 4).join('\n')}
                  </pre>
                )}
              </div>
            )}

            {/* Recovery actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-stone-950 text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recharger la page (Reload)</span>
              </button>

              <button
                onClick={this.handleResetStorage}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-surface-muted hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-xs font-medium transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Réinitialiser les données locales</span>
              </button>
            </div>

            <div className="pt-2 text-[10px] text-stone-500 font-mono">
              Venture Mind Academy • Multi-Lingual Architecture (EN / FR / ZH)
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
