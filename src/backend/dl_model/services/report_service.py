from dl_model.utils.standards import standards


def check_parameter(param, value):
    std = standards[param]
    if isinstance(std, tuple):
        if std[0] <= float(value) <= std[1]:
            return True, "✔️ Within Standard"
        else:
            return False, "❌ Out of Standard"
    elif isinstance(std, list):
        if str(value).upper() in [s.upper() for s in std]:
            return True, "✔️ Matches Standard"
        else:
            return False, "❌ Invalid Value"


def create_report(inputs, rakeId, engineer):
    report_lines = []
    failed = []
    overall_status = True

    for param, value in inputs.items():
        ok, status = check_parameter(param, value)
        if not ok:
            failed.append(param)
            overall_status = False

        std = standards[param]
        std_str = f"{std[0]} - {std[1]}" if isinstance(std, tuple) else "/".join(std)
        report_lines.append(
            {"param": param, "entered": value, "standard": std_str, "status": status}
        )

    maintenance_actions = [
        {"param": p, "entered": inputs[p], "standard": standards[p]} for p in failed
    ]

    return {
        "rakeId": rakeId,
        "engineer": engineer,
        "overall_status": "FIT" if overall_status else "UNFIT",
        "report_lines": report_lines,
        "maintenance_actions": maintenance_actions,
    }
