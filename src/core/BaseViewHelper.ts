/**
 * Created by PC on 2016/1/18.
 */
class BaseViewHelper {

    public static parentDisposer(view:any) {
        if(view == null || view.parent == null)
            return null;

        var p:BaseView = view.parent;
        return p.disposer != null ? p.disposer : BaseViewHelper.parentDisposer(p.parent);
    }
}