import os

import numpy as np
import pandas as pd

from .config import MODEL_PATH


# optional SHAP-based explainer (heavier)
def shap_explain(model, X_df):
    try:
        import shap
    except Exception:
        return None
    explainer = shap.Explainer(model, X_df)
    shap_values = explainer(X_df)
    # return top 3 features for the first sample
    sv = shap_values[0].values
    feature_names = X_df.columns.tolist()
    contribs = sorted(zip(feature_names, sv.tolist()), key=lambda x: -abs(x[1]))
    return [{"feature": f, "contribution": float(c)} for f, c in contribs[:5]]


# cheap fallback: z-score deviation times absolute layer weights approx (works for small models)
def quick_explain(X_row, X_mean, X_std, top_k=5):
    # X_row, X_mean, X_std are pandas Series indexed by feature name
    z = (X_row - X_mean).abs() / (X_std.replace(0, 1))
    top = z.sort_values(ascending=False).head(top_k)
    return [{"feature": f, "z_score": float(top.loc[f])} for f in top.index]
